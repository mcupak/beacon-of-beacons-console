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
    var iFrame = document.getElementById("ga4gh-beacon-bobby");
    if (iFrame === null) {
        document.write("<div><iframe id=\"ga4gh-beacon-bobby\"></iframe></div>");
        iFrame = document.getElementById("ga4gh-beacon-bobby");
    }

    // Define iframe's source 
    iFrame.setAttribute("src", url);

    // Calculate height: (height of each beacon + padding + footer + d3 chart)
    var height = 99.8*beaconIds.length + 93 + 20 + 63 + 80; 

    // Define frame style 
    iFrame.setAttribute("style", "width:50%; height:" + height + 'px;');
    iFrame.setAttribute("scrolling", "no");

}


