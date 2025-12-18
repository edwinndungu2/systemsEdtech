function order(product){
const phone="254706230252"; // REPLACE
const msg=`Hello EDTECH SYSTEMS, Please arrange to deliver the ${product}.`;
window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank');
}