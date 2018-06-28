#include <memory.h>
#include <stdio.h>
#include <iostream>
#include <gaborator/gaborator.h>
#include <emscripten.h>
#include <emscripten/bind.h>
// int main(int argc, char **argv) {

// }

template<typename T>
void copyToVector(const emscripten::val &typedArray, std::vector<T> &vec)
{
  unsigned int length = typedArray["length"].as<unsigned int>();
  emscripten::val memory = emscripten::val::module_property("buffer");
  
  vec.reserve(length);
  vec.resize(length);
  emscripten::val memoryView = typedArray["constructor"].new_(memory, reinterpret_cast<uintptr_t>(vec.data()), length);
  
  memoryView.call<void>("set", typedArray);
}


// extern "C" {
// EMSCRIPTEN_KEEPALIVE
// void sayHi() {
//     printf("hi\n");
// }

// EMSCRIPTEN_KEEPALIVE
// void analyze(const emscripten::val &samples) {
//     double fs = 44100;
//     gaborator::parameters params(48, 20.0 / fs, 440.0 / fs);
//     gaborator::analyzer<float> analyzer(params);
//     gaborator::coefs<float> coefs(analyzer);
//     printf("loaded gaborator\n");
//     std::vector<float> mono;
//     copyToVector(samples,mono);
//     analyzer.analyze(mono.data(), 0, mono.size(), coefs);


// }
// }



class ThomashGaborator {
    public:
        ThomashGaborator(float sampleRate):
            params(12, 200.0 / sampleRate, 440.0 / sampleRate),
            analyzer(params),
            coefs(analyzer)
            {
                analysis_support = ceil(analyzer.analysis_support());
                synthesis_support = ceil(analyzer.synthesis_support());
                std::cerr << "latency: " << analysis_support + synthesis_support << " samples\n";
                printf("loaded gaborator\n"); 
            };
        void analyze(const emscripten::val &samples, emscripten::val callback) {
            std::vector<float> mono;
            copyToVector(samples,mono);
            printf("analyzing %i\n",mono.size());
            // for(int i=0;i<mono.size();++i) {
            //     printf("%.2f \n", mono[i]);
            // }     
            analyzer.analyze(mono.data(), 0, mono.size(), coefs);
           
            // for (int band = analyzer.bandpass_bands_begin(); band < analyzer.bandpass_bands_end(); band++) {
            //     // float f_hz = analyzer.band_ff(band) * fs;
            //     // band_gains[band] = 1.0 / sqrt(f_hz / 20.0);
            //     printf("band %i\n",band);
            //  }
            apply(analyzer, coefs,
                [&](std::complex<float> &coef, int band, int64_t t) {
                     printf("applying %lld\n",t);
                    callback(coef.real(), coef.imag() ,band, (int) t);
                }); 
            printf("analyzed\n"); 
            //  callback(12);

        };
        
    private:
        gaborator::parameters params;
        gaborator::analyzer<float> analyzer;
        gaborator::coefs<float> coefs;
        size_t analysis_support;
        size_t synthesis_support;
};

EMSCRIPTEN_BINDINGS(gaborator_binding) {
  emscripten::class_<ThomashGaborator>("ThomashGaborator")
    .constructor<float>()
    .function("analyze", &ThomashGaborator::analyze)
    // .property("x", &MyClass::getX, &MyClass::setX)
    // .class_function("getStringFromInstance", &MyClass::getStringFromInstance)
    ;
}