# answers
> [!note]
> - description: allow user to exit fullscreen without trigger proctoring
> - usage: install the tampermonkey userscript and read the [#userscript for instances](../README.md/#userscript-for-instances).

> [!note]
> - you will still see proctoring alerts, but when submitting the exam, **all alerts and violations will be removed**.
> - meaning that you still see proctoring alerts in the exam, but the when submitting exam result to the server, all of the alerts will be removed.

To install the script, you need to:
1. install tampermonkey.
2. click on the raw link: https://github.com/kaedesuu/eduquizvn_cheat/raw/refs/heads/main/anti_proctor/anti_proctor.user.js
3. press `Install`.
4. read the [#userscript for instances](../README.md/#userscript-for-instances) section.

## structure
- [./index.js](./index.js): the main file, which is not minified.
- [./index.min.js](./index.min.js): the minified version of the main file.
- [./anti_proctor.user.js](./anti_proctor.user.js): for tampermonkey and userscript extensions.