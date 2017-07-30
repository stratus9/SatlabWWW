function drawSphere(r, x, y, z, n, s){
for (var i = 0; i < n+1; i++) {
  var lat = map(i, 0, n, -3.14/2, 3.14/2);
  for (var j = 0; j < n+1; j++) {
    var long = map(j, 0, n, -3.14/2, 3.14/2);
    var x = r*sin(lon) * cos(lat);
    var y = r*sin(lon) * sin(lat);
    var z = r*cos(lon);
    globe[i][j] = createVector(x,y,z);
  }

  for (var i = 0; i < n; i++) {
    beginShape(TRIANGLE_STRIP);
    for (var j = 0; j < n; j++) {
      var hu = map(j,0,total,0,255);
      fill(hu, 255, 255);
      vertex(globe[i][j].x, globe[i][j].y, globe[i][j].z);
      vertex(globe[i+1][j].x, globe[i+1][j].y, globe[i+1][j].z)
    }
  }
}
