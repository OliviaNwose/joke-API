const app = Vue.createApp({
    data() {
        return{
            jokee:"" 
        }
    },
    methods:{ 
        async getJokes(){
            const response = await axios.get('https://icanhazdadjoke.com',{ 
                headers:{ 
                    Accept:'application/json',
                }
            });
            // console.log(response);
            const data = response.data.joke
            console.log(data);
            this.jokee = data
            const message = new SpeechSynthesisUtterance();
            message.text = data;
            message.language = 'en-US'
            message.rate = 1.2
            speechSynthesis.speak(message)
        },

    },
    
    mounted(){
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition();
        recognition.interimResults = true
        recognition.addEventListener('result', (e) =>{
            const transcript = Array.from(e.results)
            .map(result=> result[0])
            .map(result => result.transcript)
            .join('');
            if (transcript == 'tell me a joke'){
                this.getJokes()
            }
        })
        recognition.addEventListener('end', recognition.start)
        recognition.start();
    }
})
app.mount("#app");



const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');
msg.text = document.querySelector('[name="text"]').value;

function populateVoices() {
  voices = this.getVoices();
  voicesDropdown.innerHTML = voices
    .filter(voice => voice.lang.includes('en'))
    .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
    .join('');
}

function setVoice() {
  msg.voice = voices.find(voice => voice.name === this.value);
  toggle();
}

function toggle(startOver = true) {
  speechSynthesis.cancel();
  if (startOver) {
    speechSynthesis.speak(msg);
  }
}

function setOption() {
  console.log(this.name, this.value);
  msg[this.name] = this.value;
  toggle();
}

speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change', setVoice);
options.forEach(option => option.addEventListener('change', setOption));
speakButton.addEventListener('click', toggle);
stopButton.addEventListener('click', () => toggle(false));
