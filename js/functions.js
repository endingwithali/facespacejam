async function submit(){
  var file = document.getElementById("fileUpload").files[0]
  var reader = new FileReader();
  console.log(file)
  if (file) {
      reader.onerror = function(e){
          console.log(e)
      }  
      reader.onloadend = async function (e) {
        console.log(e.target.result)
          await fetch(`/.netlify/functions/aws-rekog`, {
              method: 'POST',
              body: JSON.stringify({
                    image: e.target.result,
                  }),
              headers: { 'Content-Type': 'application/json' },
          }).then(response =>{
            return response.json()
          }).then(spicyResponse=>{
            console.log(spicyResponse)
            // const response = JSON.parse(resp.body)
            console.log(spicyResponse.status)
            console.log(spicyResponse.headers)

          })

      }
      const imageData = reader.readAsDataURL(file);

    }
  }
