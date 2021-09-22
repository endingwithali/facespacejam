async function submit(){
  var file = document.getElementById("fileUpload").files[0]
  const reader = new FileReader();
  if (file) {
      reader.onerror = function(e){
          console.log(e)
      }  
      reader.onloadend = async function (e) {
          console.log(e.target.result)
          await modifyImage(e.target.result)
          // process image to aws lambda function

      }
      const imageData = reader.readAsDataURL(file);
      console.log(imageData)
      // await modifyImage(imageData)
  }
  
}

async function modifyImage(imageData){
    // console.log(imageData)
    // console.log("in modify")
    //${process.env.NETLIFY_URL}/.netlify/functions/aws-rekog
    await fetch(`/.netlify/functions/aws-rekog`, {
        method: 'POST',
        body: JSON.stringify({
            image: imageData,
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => {
        console.log(res.json())
        console.log("return")
        return res
    })
    // .then((response) => {
    // });
}
