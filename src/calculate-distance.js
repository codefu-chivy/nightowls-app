//Formula for calculating the distance between 2 coordinate pairs. Credit to http://www.movable-type.co.uk/scripts/latlong.html for the formula
module.exports = (lat1, lon1, lat2, lon2) => {
    function toRadians(deg) {
        let pi = Math.PI;
        return deg * (pi / 180);    
    }
    let R = 6371; // metres
    let φ1 = toRadians(lat1);
    let φ2 = toRadians(lat2);
    let Δφ = toRadians(lat2-lat1);
    let Δλ = toRadians(lon2-lon1);
    let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
}