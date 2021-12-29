import { PythonShell } from 'python-shell';

const bypass = async (captchas: any, token: any) => new Promise((resolve: any, reject: any) => {
  const options = {
    args: [captchas[0].sitekey],
  };
  PythonShell.run(
    'src/actions/captcha/bypass.py',
    options,
    // @ts-ignore
    async (err, value) => {
        // [, captchaKey]
      const captchaKey = value ? value[1] : '';
      console.log(err, 'err', captchaKey, 'klk');
      if (err) throw err;
      const solutions = [
        {
          _vendor: (captchas[0] as any)._vendor,
          id: captchas[0].id,
          text: captchaKey,
          hasSolution: true,
        },
      ];
      resolve({ solutions });
    },
  );
});
export default bypass;
