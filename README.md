# Birthday Guestbook Site

This folder contains a static, single-page website designed for mobile browsers to celebrate Mom’s 60th birthday.

## Customize

1. **Images**
   - Replace `assets/images/mom.jpg` with a portrait (≈512×512 px).
   - Replace `assets/images/memory1.jpg`, `memory2.jpg`, etc. with your own photos.
   - Add more memory cards: duplicate the `flip-card` block in `index.html` and update paths/captions.

2. **Audio**
   - Put a short `happy_birthday.mp3` in `assets/audio/` to play when countdown hits zero.

3. **Text**
   - Change headlines, quiz questions/answers, and jokes directly in `index.html` or `script.js`.
   - Pre-written wishes live in the `wishes` array in `script.js`.

4. **Date/Countdown**
   - In `script.js`, adjust the `target` date calculation to the exact birthday/time.

5. **Deployment**
   - Since it’s static, drag-and-drop the folder to Netlify, Vercel, or GitHub Pages.

Enjoy 🎂
