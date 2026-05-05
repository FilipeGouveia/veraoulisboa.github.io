
    let score = parseInt(localStorage.getItem('score')) || 0;
    document.getElementById('score').textContent = score;

    let completedSteps = JSON.parse(localStorage.getItem('completedSteps')) || [];

    const nextBtn = document.getElementById('nextBtn');

    let timer = parseInt(localStorage.getItem('timeSpent')) || 0;
    function updateTimer() {
        timer++;
        const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
        const seconds = String(timer % 60).padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        localStorage.setItem('timeSpent', timer);
    }
    setInterval(updateTimer, 1000);

    function addScore(points, step) {
    if (!completedSteps.includes(step)) {
        score += points;
        completedSteps.push(step);
        localStorage.setItem('score', score);
        localStorage.setItem('completedSteps', JSON.stringify(completedSteps));
        document.getElementById('score').textContent = score;
    }
    }

    let currentStep = 0;
    const totalSteps = 25;

    function nextStep() {
        if (currentStep < totalSteps) {
            addScore(10, currentStep);
            currentStep++;
            showStep(currentStep);
            nextBtn.disabled = true;
            if (currentStep === totalSteps) launchConfetti();
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
            nextBtn.disabled = false;
        }
    }

    function showHint(step) {
        const hint = document.getElementById(`hint-${step}`);
        if (hint) hint.style.display = hint.style.display === 'block' ? 'none' : 'block';
    }

    function updatePreview() {
        const code = document.getElementById('editor').value;
        document.getElementById('preview').srcdoc = code;
        localStorage.setItem('code', code);
        checkCurrentStep();
    }

    function generateCertificate() {
        const name = document.getElementById('studentName').value || 'Estudante';
        const certificateHTML = `
            <div style="padding:20px;text-align:center;font-family:sans-serif">
            <h2>🎓 Certificado de Participação</h2>
            <p>Este certificado é atribuído a:</p>
            <h3>${name}</h3>
            <p>Por ter completado o tutorial de HTML & CSS no Verão ULisboa</p>
            <p><strong>Pontuação:</strong> ${score} 🧠</p>
            <p><strong>Tempo:</strong> ${document.getElementById('timer').textContent} ⏱️</p>
            <p>Data: ${new Date().toLocaleDateString()}</p>
            <p style="margin-top:20px;">FCUL - Faculdade de Ciências da Universidade de Lisboa</p>
            </div>`;
        document.getElementById('certificate').innerHTML = certificateHTML;
    }

    const validators = {
        1: code => /<h1>\s*\S[\s\S]*?<\/h1>/i.test(code),
        2: code => /<p>\s*\S[\s\S]*?<\/p>/i.test(code),
        3: code => /background-color:\s*(?:#[0-9A-Fa-f]{3,6}|\w+)/i.test(code),
        4: code => /<img\s+[^>]*src=['"][^'"]+['"]\s*[^>]*>/i.test(code),
        // 5: <a href="..."( target="_blank")?>
        5: code => /<a\s+[^>]*href=['"][^'"]+['"](?:\s+target=['"]_blank['"])?\s*>/i.test(code),
        // 6: <ul> ou <ol> com pelo menos um <li>
        6: code => /<(?:ul|ol)[\s\S]*<li>[\s\S]*<\/li>[\s\S]*<\/(?:ul|ol)>/i.test(code),
        // 7: <strong> ou <em>
        7: code => /<(?:strong|em)>[\s\S]*<\/(?:strong|em)>/i.test(code),
        // 8: classe .highlight definida e aplicada
        8: code =>
            /\.highlight\s*{[\s\S]*}/.test(code) &&
            /class=['"]highlight['"]/.test(code),
        // 9: ID #meu-titulo definido e aplicado
        9: code =>
            /#meu-titulo\s*{[\s\S]*}/.test(code) &&
            /id=['"]meu-titulo['"]/.test(code),
        // 10: display:flex em .container e .container no HTML
        10: code =>
            /\.container\s*{[^}]*display:\s*flex[^}]*}/i.test(code) &&
            /class=['"]container['"]/.test(code),
        // 11: <table> com <tr> e <th>
        11: code =>
            /<table>[\s\S]*<tr>[\s\S]*<th>[\s\S]*<\/th>[\s\S]*<\/tr>[\s\S]*<\/table>/i.test(code),
        // 12: <form> com <input type="text"> e <button type="submit">
        12: code =>
            /<form[\s\S]*<input[^>]*type=['"]text['"][\s\S]*<\/form>/i.test(code) &&
            /<button[^>]*type=['"]submit['"]/.test(code),
        // 13: pseudo-classe :hover em <a>
        13: code => /a\s*:\s*hover\s*{/.test(code),
        // 14: .caixa com margin e padding
        14: code =>
            /\.caixa\s*{[\s\S]*margin:\s*[^;]+;[\s\S]*padding:\s*[^;]+;/.test(code),
        // 15: fonte Inter e font-size configurados
        15: code =>
            /font-family:\s*['"]?Inter['"]?/.test(code) &&
            /font-size:\s*\d+(px|em|rem)/.test(code),
        // 16: img responsiva (max-width e height)
        16: code =>
            /img\s*{[\s\S]*max-width:\s*100%[\s\S]*}/i.test(code) &&
            /height:\s*auto/.test(code),
        // 17: @media query presente
        17: code => /@media\s*\([^)]+\)\s*{/.test(code),
        // 18: .grid com display:grid e grid-template-columns
        18: code =>
            /\.grid\s*{[\s\S]*display:\s*grid[\s\S]*}/i.test(code) &&
            /grid-template-columns/.test(code),
        // 19: variáveis CSS e var(--main-color)
        19: code =>
            /--main-color\s*:/.test(code) &&
            /var\(--main-color\)/.test(code),
        // 20: transition em botão
        20: code => /transition\s*:\s*[^;]+;/.test(code),

        22: code => /sobre|gosto de|tenho|chamo|anos/i.test(code),
    };

    function checkCurrentStep() {
        const code = document.getElementById('editor').value.trim();
        if (validators[currentStep]) {
            nextBtn.disabled = !validators[currentStep](code);
        } else {
            nextBtn.disabled = false;
        }
    }

    function showStep(step) {
        document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(`step-${step}`);
        if (target) target.classList.add('active');
        checkCurrentStep();
    }

    function updateHexValue() {
        const color = document.getElementById('hex-color').value;
        const output = document.getElementById('hex-value');
        output.innerHTML = `🔧 Copia esta linha para o teu CSS: <br><strong>background-color: ${color};</strong>`;
    }

    document.getElementById('editor').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const value = this.value;
            const before = value.substring(0, start);
            const after = value.substring(end);
            const prevLine = before.split('\n').slice(-1)[0];
            const indent = prevLine.match(/^\s*/)[0];
            const newValue = before + '\n' + indent + after;
            this.value = newValue;
            const pos = start + 1 + indent.length;
            this.selectionStart = this.selectionEnd = pos;
        }
    });

    //function launchConfetti() {
    //    const confetti = document.getElementById('confetti');
    //    confetti.innerHTML = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:48px;">🎉🎊</div>';
    //    setTimeout(() => confetti.innerHTML = '', 5000);
    //}

    function restartTutorial() {
        localStorage.clear();
        location.reload();
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('editor').value = localStorage.getItem('code') || defaultCode;
        updatePreview();
        checkCurrentStep();
    });

    const defaultCode =`
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body {
                    background-color: #fffff;
                    font-family: sans-serif;
                }
            </style>
        </head>
        <body>
            <h1></h1>
            <p></p>
        </body>
    </html>`;