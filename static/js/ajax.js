"use strict";
// #######################HOME.HTML####################################


$('#register-form').on('submit', (evt) => {
    evt.preventDefault();
    const formInputs = {
        'first_name': $('#first_name').val(),
        'last_name': $('#last_name').val(),
        'email': $('#email').val(),
        'password': $('#password').val(),
        'phone': $('#phone').val(),
    }

    $('.flashes').empty()

    $.post('/api/register', formInputs, (res) => {
       
        if (res != 'None') {
            $('#display-message').text(`${res.first_name} ${res.last_name} is registered!`)
        } else {
            $('#display-message').text(`An account with the email ${res.email} already exists. Please try again with a different email`)
        }
    });
});


//##########################CALLBACK YES OR NO - INPUT.HTML################################################


$('#yes').on('click', (evt) => {
    console.log("WE'VE CLICKED YES ON THE BUTTON")
    $('.job-titles').show();
    $('.audition-div').hide(); // want to add an onclick listener for which job button is pressed and then show the audition form
            
    //add listener for buttons for auditions for each job
    //get div for jobs, get current target value (job id),
    //make get request to server for any auditions for the job id
    //store job id and include in fetch/put request to server 
    //body will include formdata which is the job id
    //query db again for the event.currenttarget.val
    //call .update()
    // in server.py, the way to change this route so it can be dynamic, (put AND post) it can be a get as well.
    //jsonify all of the form fields (then we can access each form field) (not just audition_id) 0 and these can be
    //set to default values in the form (basically like autofill)

        const formData = {
            'job_id': $('#job-title').val()
        }

        $.get('/get-auditions', formData, (res) => {
            console.log(res)
        })
    })
    $('.job-button').on('click', (evt) => {
        let buttonValue = evt.currentTarget.value
        console.log(evt.currentTarget.name)
        console.log(buttonValue);
        // $('#project_title').innerHTML()
    })
    
$('#no').on('click', (evt) => {
    console.log("WE'VE CLICKED NO ON THE BUTTON")
    $('.audition-div').show();
    $('.job-titles').hide();
})
   
$(document).ready(function () {
    $('.audition').on('click', (evt) => {
        console.log(evt.currentTarget.value)
    })
});



// ########################IF NOT A CALLBACK - INPUT.HTML#######################################
const mediaUploader = document.querySelector('#media-files')
mediaUploader.addEventListener('change', function(evt) {
  //add an input text box for each media file that the user wants to upload  
})

const form = document.querySelector("#audition-form");

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    console.log("SUBMITTED FORM")

    const auditionInputs = {
        'industry': $('#industry').val(),
        'callback': $('#no').val(),
        'date': $('#date').val(),
        'time': $('#time').val(),
        'project_title': $('#project_title').val(),
        'company': $('#company').val(),
        'role': $('#role').val(),
        'casting_office': $('#casting_office').val(),
        'agency': $('#agency').val(),
        'location': $('#location').val(),
        'notes': $('#notes').val()
    };
    let audition_id = null;

    fetch('/submit-audition', {
        method: "POST",
        body: JSON.stringify(auditionInputs),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.audition_id, '*****DATA.AUDITION_ID*****'); 
        audition_id = data.audition_id;
        console.log(audition_id, '****DID AUDITION ID UPDATE?****')
        return data
    })
    .then(
    function addMedia() {
        const url = "https://api.cloudinary.com/v1_1/followspotapp/upload";
        const files = document.querySelector("[type=file]").files;
        console.log(files, '+++++FILES+++++')
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            formData.append("file", file);
            formData.append("upload_preset", "pzasmdxy");
            console.log(file, '***** A FILE *****')
            fetch(url, {
                method: "POST",
                body: formData
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(formData.values(), '------FORMDATA VALUES-----')
                document.getElementById("data").innerHTML += data.url;
                console.log(data.url)
                return data
            })
            .then((res) => fetch('/submit-media', {
                method: "POST",
                body: JSON.stringify({
                    "media_url": res.url,
                    "media_title": $('#media-title').val(),
                    "audition_id" : audition_id // console.log in line 104 worked, so we can put : audition_id
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
        }))
        .then((res) => res.json())
        .then((data) => console.log(data))
        console.log(formData)
    }
})
});