

// function onRuntimeInitialized() {
  
const em_module = require('./wrap_gaborator.js');

// async function getWrapper() {

//     const m = em_module();
//     console.log(m.then);    
//     const module= await m;
//     console.log(module);
//     return module;
// }

// async function testGaborator() {
//     const wrapper = await getWrapper();
//     wrapper._sayHi();
// }

// testGaborator();

const width=1024;
const height=768;

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')
ctx.globalCompositeOperation = 'lighten';
ctx.antialias = 'subpixel'
ctx.fillStyle = 'rgba(0,0,0,1)';
ctx.fillRect(0,0,canvas.width,canvas.height);
// ctx.strokeStyle='rgba(0,0,0,0)'
// Write "Awesome!"
// ctx.font = '30px Impact'
// ctx.rotate(0.1)
// ctx.fillText('Awesome!', 50, 100)

// // Draw line under text
// var text = ctx.measureText('Awesome!')
// ctx.strokeStyle = 'rgba(0,0,0,0.5)'
// ctx.beginPath()
// ctx.lineTo(50, 102)
// ctx.lineTo(50 + text.width, 102)
// ctx.stroke()
// const totalBands = 120;

function pixel(x,band, intensity,totalBands, totalSamples) {
    const r = 1;
    const g = r;
    const b = r;
    // console.log(intensity)
    let a = Math.min(Math.max(0, Math.log(intensity*100.0+1.0 )),1);
    if (a > 0.000) {    
        // console.log(a);
        ctx.fillStyle = "rgba("+(r*255)+","+(g*255)+","+(b*255)+","+(a)+")";
    // console.log("rgba("+(r*255)+","+(g*255)+","+(b*255)+","+(a)+")");
        ctx.fillRect(x*width/totalSamples, band*height/totalBands, 5.0,  height/totalBands);
    }
}

// pixel(1,1,0,0,0);

var fs = require('fs');
var out = fs.createWriteStream(__dirname + '/text.png');   

const loader = require('audio-loader')

const m = em_module();

    m.then(({ThomashGaborator}) => {
        // console.log(Object.keys(Module.ThomashGaborator))
        // Module._analyze(Float32Array.from([0,1,0,0.5]));


        console.log(ThomashGaborator);

        let maxIntensity = -Infinity;
        let minIntensity  = Infinity;

        loader("./media/modular.wav").then(audio =>   {
            const gaborator= new ThomashGaborator(audio.sampleRate,48,20.0);
            const data = audio.getChannelData(0);
            const length = audio.length;
            // console.log(data);
            const numBands = gaborator.numBands();
            // gaborator.analyze(data,function(mag,band,t)  {
            //     // console.log("resuult",{real,imag,band,t});
            //     const intensity=mag*mag  ;
            //     maxIntensity= Math.max(intensity,maxIntensity);
            //     minIntensity= Math.min(intensity,minIntensity);
            //     // numBands = Math.max(band,numBands)
            //     // console.log(t/length, band/72, 0,0,0,intensity)
            // });
            // console.log({maxIntensity,minIntensity,numBands});
            gaborator.analyze(data,function(mag,band,t)  {
                // console.log("resuult",{real,imag,band,t});
                const intensity=mag;
                const normalizedIntensity= intensity;//(intensity-minIntensity)/(maxIntensity-minIntensity) ;
                pixel(t, band, normalizedIntensity,numBands,length);

                // console.log(t/length, band/72, 0,0,0,intensity)
            });


            var stream = canvas.pngStream();


                stream.on('data', function(chunk){out.write(chunk); });

                stream.on('end', function(){console.log('saved png'); }); 



            console.log(data.length)
        })
        .catch(e => console.error(e));
        
        // const data=new Float32Array(44100).fill(1.0)    ;

    })



// Module['onRuntimeInitialized'] = onRuntimeInitialized;


// em_module.ccall("sayHi"); // using ccall etc. also work
// console.log(em_module._daysInWeek()); // values can be returned, etc.
