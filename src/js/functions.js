async function submit(){
  var file = document.getElementById("fileUpload").files[0]
  var reader = new FileReader();
  if (file) {
      reader.onerror = function(e){
          console.log(e)
      }  
      reader.onloadend = async function (e) {
          await fetch(`/.netlify/functions/aws-rekog`, {
              method: 'POST',
              body: JSON.stringify({
                    image: e.target.result,
                  }),
              headers: { 'Content-Type': 'application/json' },
          }).then(response =>{
            if (response.status != '200'){
              // throw (errror)
              return; 
            }
            console.log(response.status)
            return response.json()
          }).then(spicyResponse=>{
            if (spicyResponse){
              console.log(spicyResponse)
            }
            return;
            
          })

      }
      const imageData = reader.readAsDataURL(file);

    }
  }
