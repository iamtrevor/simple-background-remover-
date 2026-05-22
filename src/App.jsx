import {useState, useRef} from 'react'
import { removeBackground } from "@imgly/background-removal";


import './App.css'

function App() {

    const [originalImage, setOriginalImage] = useState(null)
    const [processedImage, setProcessedImage] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isError, setIsError] = useState(null)
    const fileInputRef = useRef(null)

    const handleFileSelect = async (file) => {
        if(!file || !file.type.startsWith("image/")){
            setIsError('Please select a file')
            return;
        }
        setIsError(null)
        setProcessedImage(null)

        const reader = new FileReader()

        reader.onload = (e) => {
            if(e.target && typeof e.target.result === "string"){
                setOriginalImage(e.target.result)
            }
        };
        reader.readAsDataURL(file);
        setIsProcessing(true)

        try {
            const blob = await removeBackground(file)
            const url = URL.createObjectURL(blob);
            setProcessedImage(url)
        } catch (err){
            setIsError("Failed to process image")
            console.error("background removal error", err)
        } finally {
            setIsProcessing(false)
        }
    }


    const handleDragOver = (e) => {
         e.preventDefault()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        handleFileSelect(file)
    }

    //if you want to select another file
    const handleFileInputChange = (e) => {

        const file = e.target.files && e.target.files[0]
        handleFileSelect(file)
    }

    const downloadImage = () => {
        if(!processedImage) return;
        const link = document.createElement("a");
        link.href = processedImage;
        link.download = "background-removed.png";
        link.click();
        URL.revokeObjectURL(processedImage);
    }

    const resetApp = () => {
        setProcessedImage(null)
        setIsProcessing(false)
        setOriginalImage(null)
        setIsError(null)
        if(fileInputRef.current) fileInputRef.current.value = ""
    }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-950 via-neutral-900 to-purple-950 flex flex-col items-center justify-center p-4 gap-12">
        <h1 className="text-7xl text-center bg-gradient-to-r text-purple-200">Background Remover</h1>


          <div className="w-full max-w-2xl bg-gradient-to-r from-fuchsia-900 to-indigo-950 backdrop-blur-md border border-fuchsia-500/3 rounded-3xl p-4 sm:p-6 shadow-2xl">
              {!originalImage && (
                  <div className="flex flex-col items-center justify-center
                   h-96 mb-6 p-4 bg-gradient-to-b from-indigo-950/40
                   to-fuchsia-950/50 rounded-2xl opacity-80 hover:opacity-100
                    hover:shadow-fuchsia-700 shadow-2xl transition-all duration-400
                     text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}>

                      <div className="text-4xl sm:text-5xl mb-4">📷</div>
                      <div className="text-lg sm:text-xl text-fuchsia-200 mb-2 ">
                          Drag amd Drop or click to upload an image
                      </div>
                      <div className="text-fuchsia-400">
                          JPEG, PNG, WEBP supported
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*" className="hidden"/>

                  </div>
              )}

              {isError && <div className="text-center text-pink-400 mb-4">{isError}</div>}

              {originalImage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col items-center">
                            <div className="text-fuchsia-300 text-xl mb-2">
                                Original
                            </div>
                          <div className="aspect-square w-full max-w-md mx-auto border-2 border-fuchsia-600/50 rounded-2xl
                          overflow-hidden flex items-center justify-center">
                              <img src={originalImage} alt="Original Image" className="object-contain h-full w-full"/>
                          </div>
                      </div>


                      <div className="flex flex-col items-center">
                         <div className="text-fuchsia-300 text-xl mb-2">Background removed</div>




                          <div className="aspect-square w-full max-w-md max-auto border-2 border-fuchsia-600/50 rounded-2xl overflow-hidden flex items-center justify-center">

                              {processedImage ? (

                                  <img
                                      src={processedImage}
                                      alt="processed Image"
                                      className="object-contain h-full w-full"
                                  />

                              ) : (

                                  <div className="flex flex-col items-center justify-center w-full h-full text-fuchsia-400">

                                      {isProcessing ? (

                                          <div className="flex items-center gap-2">
                                              <div className="w-8 h-8 border-4 animate-spin rounded-full border-fuchsia-300/30 border-t-fuchsia-100"></div>
                                              Processing...
                                          </div>

                                      ) : (

                                          <span>Processed image will appear here</span>

                                      )}

                                  </div>

                              )}

                          </div>


                          {originalImage && (
                              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center items-center mt-4">

                                  <button
                                      onClick={downloadImage}
                                      disabled={!processedImage}
                                      className="px-6 py-3 bg-gradient-to-r from-fuchsia-900 to-pink-400 hover:opacity-80 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                      {processedImage ? "⬇️ Download Result" : "Processing"}
                                  </button>

                                  <button
                                      onClick={resetApp}
                                      className="px-6 py-3 bg-gradient-to-r from-fuchsia-900 to-pink-400 hover:opacity-80 text-white font-semibold rounded-2xl cursor-pointer"
                                  >
                                      🔃 Process another image
                                  </button>

                              </div>
                          )}





                      </div>


                  </div>

              )}


          </div>

      </div>
    </>
  )
}

export default App
