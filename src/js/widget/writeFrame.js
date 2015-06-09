function writeIFrame(chromosome, position, allele, genome, beacons) {

    var iFrame = document.getElementById("ga4gh-beacon-bobby");
    var url = "http://localhost:8888/widget.html?"; // baseURL of the iframe 
    url += "\&ref=" + genome + "\&pos=" + position + "\&allele=" + allele + "\&chrom=" + chromosome ;
    var beaconIds = [];
    if (beacons != null){
        for (var i in beacons) {
        beaconIds.push(beacons[i]);
        }
        url += "\&beacon=" + "[" + beaconIds + "]#results";
    }
   
    if (iFrame === null) {
        document.write("<div><iframe id=\"ga4gh-beacon-bobby\" src=" + url + "></iframe></div>");
    }
    else {
        iFrame.setAttribute("src", url);
    }
    //css to only display the results in the IFrame
    document.getElementById("ga4gh-beacon-bobby").setAttribute("style", "width:50%; height:75%");

}


