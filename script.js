    // Change this to your meeting date: MMDDYY (e.g. June 15, 2020 → 061520)
    const PASSCODE = '122724';

    const lockScreen = document.getElementById('lock-screen');
    const letterScreen = document.getElementById('letter-screen');
    const form = document.getElementById('passcode-form');
    const digitRow = document.getElementById('digit-row');
    const errorMsg = document.getElementById('error-msg');
    const digits = [...document.querySelectorAll('.digit')];
    const lockAgainBtn = document.getElementById('lock-again');

    digits[0].focus();

    function getPasscode() {
      return digits.map((d) => d.value).join('');
    }

    function clearDigits() {
      digits.forEach((d) => { d.value = ''; });
      digits[0].focus();
    }

    function showError() {
      errorMsg.classList.remove('hidden');
      digitRow.classList.add('shake');
      setTimeout(() => digitRow.classList.remove('shake'), 500);
      clearDigits();
    }

    function openLetter() {
      errorMsg.classList.add('hidden');
      lockScreen.classList.add('hidden');
      letterScreen.classList.remove('hidden');
      document.body.classList.remove('lock-page');
      document.body.classList.add('letter-page');
      document.title = 'For You, Graduate';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function closeLetter() {
      letterScreen.classList.add('hidden');
      lockScreen.classList.remove('hidden');
      document.body.classList.remove('letter-page');
      document.body.classList.add('lock-page');
      document.title = 'Access Required';
      clearDigits();
      errorMsg.classList.add('hidden');
    }

    function tryUnlock() {
      if (getPasscode() === PASSCODE) {
        openLetter();
      } else {
        showError();
      }
    }

    digits.forEach((input, i) => {
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val.slice(-1);
        if (val && i < 5) digits[i + 1].focus();
        if (getPasscode().length === 6) tryUnlock();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && i > 0) {
          digits[i - 1].focus();
        }
        if (e.key === 'ArrowLeft' && i > 0) digits[i - 1].focus();
        if (e.key === 'ArrowRight' && i < 5) digits[i + 1].focus();
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        pasted.split('').forEach((ch, j) => { digits[j].value = ch; });
        if (pasted.length === 6) tryUnlock();
        else digits[Math.min(pasted.length, 5)].focus();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (getPasscode().length < 6) {
        errorMsg.textContent = 'Please enter all 6 digits.';
        errorMsg.classList.remove('hidden');
        return;
      }
      tryUnlock();
    });

    lockAgainBtn.addEventListener('click', closeLetter);