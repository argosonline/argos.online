// ——————————————————————————————————————————————————
// ScrambleTextEffect
// ——————————————————————————————————————————————————

class ScrambleTextEffect {
  constructor(element) {
      this.element = element;
      this.characters = '!<>-_\\/[]{}—=+*^?#________';
      this.updateText = this.updateText.bind(this);
  }

  setText(newText) {
      const oldText = this.element.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.textQueue = [];

      for (let i = 0; i < length; i++) {
          const fromChar = oldText[i] || '';
          const toChar = newText[i] || '';
          const startFrame = Math.floor(Math.random() * 40);
          const endFrame = startFrame + Math.floor(Math.random() * 40);
          this.textQueue.push({ fromChar, toChar, startFrame, endFrame });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.updateText();
      return promise;
  }

  updateText() {
      let output = '';
      let completed = 0;

      for (let i = 0, n = this.textQueue.length; i < n; i++) {
          let { fromChar, toChar, startFrame, endFrame, char } = this.textQueue[i];
          if (this.frame >= endFrame) {
              completed++;
              output += toChar;
          } else if (this.frame >= startFrame) {
              if (!char || Math.random() < 0.28) {
                  char = this.randomCharacter();
                  this.textQueue[i].char = char;
              }
              output += `<span class="scrambled-dud">${char}</span>`;
          } else {
              output += fromChar;
          }
      }

      this.element.innerHTML = output;
      if (completed === this.textQueue.length) {
          this.resolve();
      } else {
          this.frameRequest = requestAnimationFrame(this.updateText);
          this.frame++;
      }
  }

  randomCharacter() {
      return this.characters[Math.floor(Math.random() * this.characters.length)];
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

document.addEventListener('DOMContentLoaded', function() {
  const scramblePhrases = [
      'ようこそ',
  ];

  const scrambleElement = document.querySelector('.scrambled-text');
  const scrambleEffect = new ScrambleTextEffect(scrambleElement);

  let scrambleCounter = 0;
  const nextPhrase = () => {
      scrambleEffect.setText(scramblePhrases[scrambleCounter]).then(() => {
          setTimeout(nextPhrase, 800);
      });
      scrambleCounter = (scrambleCounter + 1) % scramblePhrases.length;
  };

  nextPhrase();
});
