![Screenshot of the application](res/example.jpeg)

# About
Our little contribution at the [Open Data Crunch](http://www.dresden.de/de/wirtschaft/wirtschaftsstandort/projekte-kooperationen/open-data-crunch.php) competition during the [Datenspuren 2016](https://www.datenspuren.de/2016/fahrplan.html).

The problem we are tackling with this app is how to find an appropriate place in a new and unknown city fitting best to ones needs. Or to put it simple: Which part of town fits me most?

To answer this question we solely use demographic data provided by the city of Dresden.

# Video
For an even better introduction to this package than the description above check out our [presentation at the Datenspuren](https://www.youtube.com/watch?v=znWmLYXqkpQ&feature=youtu.be) 

# Installation
## Via an Apache

One possible way to use this app is via an apache server.

``` bash
sudo apt install apache2
```

and copy the content of this repository to /var/www/html

## Via npm

Alternatively you can use [node.js](https://nodejs.org/en/).

``` bash
sudo npm install -g http-server
http-server
```
