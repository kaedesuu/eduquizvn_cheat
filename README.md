# eduquizvn_cheat
this platform is still new, I'm not sure if there are many instances out there.\
this script is built only for private instances. I'm not really sure if this script can run on all instances.\

# instance awareness
To know if you are on a eduquiz.vn instance, you might need to consider if the following conditions are true:
- Your school or academy uses a `lms` system
- The school or academy location is located in VN.
- They have both login buttons for students and teachers on the front page.
- The page looks heavily vibe coded.
- The website's subdomain **might have** the keyword `lms`, (e.g. `lms.school.edu.vn`, `lms.academy.edu.vn`, ...)

If most of the conditions above are true, try to run the [detect.js](./detect.js) in the browser console to see if your teacher is using eduquiz.vn's private instance.

# userscript for instances
- After you have added the tampermonkey userscript, you still need to perform a manual edit because I don't know your teacher's `lms` domain.
1. click on the tampermonkey extension icon, try to open the popup (it should show a popup with menu to find new scripts or create new script)
2. click on the `Dashboard` button.
3. click on the name of the script you installed. If you install answer cheat, click on `eduquiz_answer`.
4. edit this line in the tampermonkey script:
```js
// @match        https://lms.eduquiz.vn/*
```

to **your school or academy's domain for the `lms` system**:

```js
// @match        https://lms.school.edu.vn/*
```

> [!note]
> `lms.school.edu.vn` should be the subdomain or domain of the private `lms` instance.

# installation
1. install userscripts extension. I recommend using tampermonkey.
2. choose **a script** you want to install:
- [answers](./answers): get correct answers for exams and homeworks from the instance's backend.
- [inf_time](./inf_time/): make the exam time infinite.
- [anti_proctor](./anti_proctor/): allow user to exit fullscreen without trigger proctoring (also please read the note carefully in the [anti_proctor's README.md](./anti_proctor/README.md))

> [!note]
> as of now, you can only enable 1 userscript due to userscripts hook the same function.\
> you can install 3 userscripts and enable only one, and then disable the others to use that specific cheat userscript you enabled.

# disclaimer
The content and code in this repository are provided solely for **educational and research purposes**.\
**You're 100% responsible for your own actions.** By downloading, viewing, or utilizing any code or information provided in this repository, you acknowledge and agree that the creator/author of this project is in no way liable for damages, bans, or legal consequences that may arise from misuse or misapplication.