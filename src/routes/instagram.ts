import { Router } from 'express';
const Instagram = require('instagram-web-api');

const instagramRouter = Router();

const username = 'betueltech';
const password = '15282118';
instagramRouter.post('', async (req, res) => {
  try {
    const client = new Instagram({
      username: 'betueltech',
      password: 15282118,
    });
    await client.login();

    // const getPostPictures = async () => {
    //   await client.getPhotosByUsername({ username }).then((response: any) => console.log('response', response));
    // };
    //
    // getPostPictures();
    res.send('success');
  } catch (error: any) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

export default instagramRouter;
