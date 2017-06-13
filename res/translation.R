#####################################################################
#####################################################################
### This file contains my main contribution to the Stadtteile project
### done the Saturday of the Open Data Crunsh. - P
### Its purpose is to convert the district specific information
### provided by J as a .csv file in a format compatible with the POI
### extracted from the openstreetmap API. To do this it imports the
### polygons of the individual districts and performs a point in
### polygon test. In the end a summary statistic is exported as GeoJSON
### It just a hack we did over the weekend. So we do not have a nice
### function for downloading the required data for the script (and
### its to big to put it into this repository). Sorry
#####################################################################
library( geojsonio )
library( rjson )
library( rgeos )
library( rgdal )

stadtteile <- geojson_read( "./BBK_stadtteile.json" )

## stadtteile
mapping.number.name <- data.frame(
    name = Reduce( c, lapply( stadtteile[[ 3 ]], function( x ) x$properties$name ) ),
    id = Reduce( c, lapply( stadtteile[[ 3 ]], function( x ) as.numeric( x$properties$nummer ) ) ),
    area = Reduce( c, lapply( stadtteile[[ 3 ]], function( x ) x$properties$flaeche_km2) ) )
write.table( mapping.number.name, file = "./mapping.table",row.names = FALSE )

stadt.sp <- geojson_sp( as.json( stadtteile ) )
kinder.sp <- geojson_sp( as.json( kinder.geo ) )

stadt.poly <- polygons(stadt.sp)



extract.stadtteil.id <- function( coords, stadt.poly ){
    pip <- list()
    for ( ll in 1 : length( stadt.poly ) )
        pip[[ ll ]] <- point.in.polygon( coords[ , 1 ], coords[ , 2 ],
                                        stadt.poly[ ll ]@polygons[[ 1 ]]@Polygons[[ 1 ]]@coords[ , 1 ],
                                        stadt.poly[ ll ]@polygons[[ 1 ]]@Polygons[[ 1 ]]@coords[ , 2 ] )
    pip.matrix <- Reduce( cbind, pip )
    return( apply( pip.matrix, 1, function( x ) which( x == 1 ) ) )
}


## POI coordinates
kinder.geo <- geojson_read( "./kindergaerten.geojson" )                  
kinder.co <- coordinates( geojson_sp( as.json( kinder.geo ) ) )
sports.co <- coordinates( geojson_sp( as.json( geojson_read( "./sport.geojson" ) ) ) )
pubs.co <- coordinates( geojson_sp( as.json( geojson_read( "./pubs.geojson" ) ) ) )
schulen.co <- coordinates( geojson_sp( as.json( geojson_read( "./schools.geojson" ) ) ) )
playground.co <- coordinates( geojson_sp( as.json( geojson_read( "./playground.geojson" ) ) ) )
vvo.co <- coordinates( geojson_sp( as.json(
    geojson_read( "~/tmp/daten/Dresden_EPSG_4326/Verkehr/VVO-Haltestellen Dresden.json" ) ) ) )

## all together
bulk.co <- rbind( kinder.co, schulen.co, playground.co, sports.co, pubs.co, vvo.co )
bulk.row.list <- extract.stadtteil.id( bulk.co, stadt.poly )
bulk.row <- as.numeric( bulk.row.list )
bla <- numeric()
for ( bb in 1 : length ( bulk.row ) )
    bla <- c( bla, as.numeric( mapping.number.name[ bulk.row[ bb ], 2 ] ) ) 

## kita, schule, spielplatz = 1
poi <- data.frame( lon = bulk.co[ , 1 ], lat = bulk.co[ , 2 ],
                  id = bla,
                  type = c( rep( 1, nrow( kinder.co ) + nrow( schulen.co ) + nrow( playground.co ) ),
                           rep( -1, nrow( sports.co ) + nrow( pubs.co ) ),
                           rep( 0, nrow( vvo.co ) ) ),
                  haltestelle = c( rep( 0, nrow( kinder.co ) + nrow( schulen.co ) +
                                           nrow( playground.co ) + nrow( sports.co ) +
                                           nrow( pubs.co ) ),
                                  rep( 1, nrow( vvo.co ) ) ) )
poi$dichte <- poi$farbe <- poi$wahl <- NaN

## introducing Justus' part
jus.table <- read.table( "../Data/Summary/stadtteil_properties.csv", sep = ",", header = T )

for ( rr in 1 : length( jus.table$id ) ){
    print( rr )
    poi$dichte[ poi$id == jus.table$id[ rr ] ] <- jus.table$Bevolkerungsdichte[ rr ]
    poi$wahl[ poi$id == jus.table$id[ rr ] ] <- jus.table$Wahl[ rr ]
    poi$farbe[ poi$id == jus.table$id[ rr ] ] <- jus.table$Farbe[ rr ]
}

poi.reformat.aux <- data.frame( lon = poi$lon, lat = poi$lat, wahl = poi$wahl, dichte = poi$dichte,
                           farbe = poi$farbe, kinder = poi$type, haltestelle = poi$haltestelle )
## delete stations not in Dresden
poi.reformat <- poi.reformat.aux[ -c( which( is.nan( poi.reformat.aux$wahl ) ) ), ]
    
#write.table( poi.reformat, file = "./matrix.csv", sep = ",", row.names = FALSE )
geojson_write( poi.reformat, file = "myfile2.geojson" )
