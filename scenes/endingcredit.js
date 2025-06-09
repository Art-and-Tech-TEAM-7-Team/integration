export function makeEndingcreditSketch(){
    return function(p){
        let endingcreditIMG;
        p.preload=function(){
            endingcreditIMG = p.loadImage("assets/endingcredit.jpg")
        } 
        p.setup=function(){
            p.createCanvas(p.windowWidth, p.windowHeight);
        }
        p.draw=function(){
            p.background(220);
            p.image(endingcreditIMG, 0, 0, p.windowWidth, p.windowHeight); 
            // drawText();

        }
        p.windowResized = function() {
         p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

    }
   


    
}