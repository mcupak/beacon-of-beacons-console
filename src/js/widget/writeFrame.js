function writeIFrame(chromosome, position, allele, genome, beacons) {

    /* Write the source URL of the iframe based on the API */ 

    // baseURL of the iframe 
    var url = "http://localhost:8888/widget.html?"; 

    // genome reference parameter 
    url += (genome == "all") ? "\&ref=" : ("\&ref="+genome);

    // position, allele, and chromosome parameters 
    url += "\&pos=" + position + "\&allele=" + allele + "\&chrom=" + chromosome ;

    // beacons parameters 
    var beaconIds = [];
    if (beacons != null){
        for (var i in beacons) {
        beaconIds.push(beacons[i]);
        }
        url += "\&beacon=" + "[" + beaconIds + "]#results";
    }
   
    /* Define the Iframe and its styling */  
    
    // Intialize the DOM element 
    var iFrame = document.getElementById("ga4gh-beacon-widget");
    if (iFrame === null) {
        document.write("<div><iframe id=\"ga4gh-beacon-widget\"></iframe></div>");
        iFrame = document.getElementById("ga4gh-beacon-widget");
    }

    // Define iframe's source 
    iFrame.setAttribute("src", url);

    // Define frame style 
    iFrame.setAttribute("style", "width:500px; height:50%");
    iFrame.setAttribute("scrolling", "yes");

}


