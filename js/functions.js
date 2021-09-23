async function submit(){
  var file = document.getElementById("fileUpload").files[0]
  var reader = new FileReader();
  console.log(file)
  if (file) {
      reader.onerror = function(e){
          console.log(e)
      }  
      reader.onloadend = async function (e) {
        // console.log("beef")
        // console.log(e.target.result)
        // var resp =  fetch(`/.netlify/functions/aws-rekog`, {
        //   method: 'POST',
        //   body: JSON.stringify({
        //         image: e.target.result,
        //       }),
        //   headers: { 'Content-Type': 'application/json' },
        //     }
        //   )
        //   console.log(resp)
        //   // const response = JSON.parse(resp.body)
        //   console.log(resp.status)
        //   console.log(resp.headers)
        //   console.log(resp.json().error)
        //   return resp
        // }
          await fetch(`/.netlify/functions/aws-rekog`, {
              method: 'POST',
              body: JSON.stringify({
                    image: e.target.result,
                  }),
              headers: { 'Content-Type': 'application/json' },
          }).then(resp =>{
            console.log(resp)
            // const response = JSON.parse(resp.body)
            console.log(resp.status)
            console.log(resp.headers)
            console.log(resp.json().error)
            return resp
          }).finally(m=>{
            console.log(m)
          })

  
      }
      const imageData = reader.readAsDataURL(file);

    }
      
      //   await modifyImage(e.target.result)
      //   // process image to aws lambda function

      // }
      // reader.onloadend = async function (e) {
      //   console.log('hello')
        // console.log(e.target.result)
          // const response = await fetch(url, {
          //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
          //   // mode: 'cors', // no-cors, *cors, same-origin
          //   // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          //   // credentials: 'same-origin', // include, *same-origin, omit
          //   headers: {
          //     'Content-Type': 'application/json'
          //     // 'Content-Type': 'application/x-www-form-urlencoded',
          //   },
          //   // redirect: 'follow', // manual, *follow, error
          //   // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          //   body: JSON.stringify({
          //     image: e.target.result,
          //   }) // body data type must match "Content-Type" header
          // });
          // console.log("ehre")
          // console.log(response)
          // console.log(response.json()); // parses JSON response into native JavaScript objects
        
          // await fetch(`/.netlify/functions/aws-rekog`, {
          //     method: 'POST',
          //     body: JSON.stringify({
          //           image: e.target.result,
          //         }),
          //     headers: { 'Content-Type': 'application/json' },
          // }).then(resp =>{
          //   console.log(resp)
          //   // const response = JSON.parse(resp.body)
          //   console.log(resp.status)
          //   console.log(resp.headers)
          //   console.log(resp.json().error)
          //   return resp
          // }).finally(m=>{
          //   console.log(m)
          // })
          
        //   modifyImage(e.target.result).then(resp=>{
        //     console.log(resp)
        //     // process image to aws lambda function
        //     console.log("response")
        //     // const response = JSON.parse(resp.body)
        //     console.log(resp.status)
        //     console.log(resp.body)
        //     if (resp.status=='400'){
        //       console.log(resp.json())
        //     }
        //   })
        // }


      // }
      // const imageData = reader.readAsDataURL(file);
      // console.log(imageData)
      // await modifyImage(imageData)

function modifyImage(imageData){
    // console.log(imageData)
    // console.log("in modify")
    //${process.env.NETLIFY_URL}/.netlify/functions/aws-rekog
    return fetch(`/.netlify/functions/aws-rekog`, {
        method: 'POST',
        body: JSON.stringify({
            image: imageData,
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    // .then((response) => {
    // });
}
