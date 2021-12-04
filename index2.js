const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const mysql = require('mysql2');

const importantData = {
  credentials: [
    {
      email: 'audsongs@hotmail.com', // fb email, phone, or username
      pass: 'washicolesten', // fb password
    },
  ],
  timeoutBetweenPages: 10000, // this will be according to the internet speed, i
  // ts' the time to get completed loaded the profile page for each user it's in milliseconds unit
  tableName: 'UsersHTFB',
};

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'root',
});

/* generateInfoPages, process all data from the profile page
* @return: object data from the profila page
* */
const getAboutInfo = () => {
  const logOut = async () => {
    // click in the checron down of facebook
    document.querySelector('.bp9cbjyn[role="navigation"] span.tojvnm2t .q676j6op .s45kfl79').click();
    // click in log Out
    setTimeout(() => {
      Array.from(document.querySelectorAll('.scb9dxdr .l9j0dhe7 .j83agx80 .hzawbc8m')).filter((item) => item.innerText === 'Salir' || item.innerText === 'Cerrar sesión')[0].click();
    }, 300);

    return await false;
  };

  // this element appears when the user has been blocked
  const blocked = document.querySelector('.gh1tjcio .oajrlxb2 .rq0escxv .bp9cbjyn .d2edcug0 .a8c37x1j');
  if (blocked) {
    console.log('blocked');
    return logOut();
  }

  const generalInfoDomRef = 'div.sjgh65i0 div.buofh1pr div.discj3wi';
  const results = document.querySelector(generalInfoDomRef);
  return (results ? results.innerText.replace(/[']/gi, '`') : 'no se encontro nada') || 'nada';
};

/* generateInfoPages, process all data from the profile page
* @return: object data from the profila page
* */
const getProfileInfo = () => {
  window.scroll(0, 300);
  // src="/images/comet/empty_states_icons/permissions/permissions_dark_mode.svg"
  // img[src="/images/comet/empty_states_icons/permissions/permissions_gray_wash.svg"]
  const unavailableUser = document.querySelector('img[src="/images/comet/empty_states_icons/permissions/permissions_dark_mode.svg"]');
  if (unavailableUser) {
    return 0;
  }

  const getPropertyFromTag = (selectorRef, property = 'innerText') => !!document.querySelector(selectorRef) && document.querySelector(selectorRef)[property];
  const getPropertyFromTags = (selectorRef, property = 'href') => Array.from(document.querySelectorAll(selectorRef)).map((item) => item[property]).join((', '));

  const { href } = location;
  const username = href.includes('?id=') ? href.split('=')[1] : location.pathname.replace(/[/]/gi, '');
  const userData = {
    profileUrl: href,
    username,
  };

  const userDataPropertiesDOMRef = {
    fullName: 'div.bi6gxh9e h1.gmql0nx0',
    friends: 'span.m9osqain a.lrazzd5p',
    friends2: `a[href="https://www.facebook.com/${username}/friends"]`,
    profileImgUrl: 'div a.oo9gr5id',
    wallpaperImgUrl: 'div.bti8j40k a.oajrlxb2',
    photosUrls: 'div.qno324ep div.k4urcfbm a.k4urcfbm',
  };

  let friends = getPropertyFromTag(userDataPropertiesDOMRef.friends).toString().replace(/[']/gi, '`');
  if (!parseInt(friends.replace('Amigos', ''))) {
    friends = getPropertyFromTag(userDataPropertiesDOMRef.friends2).toString().replace(/[']/gi, '`');
  }
  userData.fullName = getPropertyFromTag(userDataPropertiesDOMRef.fullName).toString().replace(/[']/gi, '`');
  userData.friends = friends;
  userData.profileImgUrl = getPropertyFromTag(userDataPropertiesDOMRef.profileImgUrl, 'href');
  userData.wallpaperImgUrl = getPropertyFromTag(userDataPropertiesDOMRef.wallpaperImgUrl, 'href');
  userData.photosUrls = getPropertyFromTags(userDataPropertiesDOMRef.photosUrls);
  return userData;
};

const host = 'https://www.facebook.com/';
/* generateInfoPages, generate all url related to information about the user
* @param username: fb username
* @return: object with all pages about username
* */
const generateInfoPages = (username, useProfilePhp) => ({
  about: `${host}${useProfilePhp ? `profile.php?id=${username}` : username}${useProfilePhp ? '&sk=' : '/'}about`,
  workAndEducation: `${host}${useProfilePhp ? `profile.php?id=${username}` : username}${useProfilePhp ? '&sk=' : '/'}about_work_and_education`,
  address: `${host}${useProfilePhp ? `profile.php?id=${username}` : username}${useProfilePhp ? '&sk=' : '/'}about_places`,
  basic: `${host}${useProfilePhp ? `profile.php?id=${username}` : username}${useProfilePhp ? '&sk=' : '/'}about_contact_and_basic_info`,
  importantEvents: `${host}${useProfilePhp ? `profile.php?id=${username}` : username}${useProfilePhp ? '&sk=' : '/'}about_life_events`,
  familyAndRelationships: `${host}${useProfilePhp ? `profile.php?id=${username}` : username}${useProfilePhp ? '&sk=' : '/'}about_family_and_relationships`,
  extraDetails: `${host}${useProfilePhp ? `profile.php?id=${username}` : username}${useProfilePhp ? '&sk=' : '/'}about_details`,
});

const insertUser = (user) => {
  connection.query(`
    INSERT INTO ${importantData.tableName}
        (fullName, friend, profileImgUrl, wallpaperImgUrl, photosUrls,
        profileUrl, username, generalInfo, workAndEducationInfo, locationInfo,
        basicInfo, familyAndRelationshipInfo, extraDetailsInfo, importantEventsInfo)
    VALUES
        ('${user.fullName}', '${user.friends}', '${user.profileImgUrl}', '${user.wallpaperImgUrl}',
         '${user.photosUrls}', '${user.profileUrl}', '${user.username}', '${user.generalInfo}',
         '${user.workAndEducationInfo}', '${user.locationInfo}', '${user.basicInfo}',
         '${user.familyAndRelationshipInfo}', '${user.extraDetailsInfo}', '${user.importantEventsInfo}')`,

  (err, results) => {
    if (err) throw err;
  });
};

let credentialsIndex = 0;
const logIn = async (page) => {
  await page.waitForTimeout(3000);
  await page.waitForSelector('#email');
  await page.type('#email', importantData.credentials[credentialsIndex].email);
  await page.type('#pass', importantData.credentials[credentialsIndex].pass);
  return await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNetworkIdle(),
  ]);
};

const checkIfBlocked = async (data, page, url) => {
  if (!data) {
    credentialsIndex = credentialsIndex === (importantData.credentials.length - 1) ? 0 : credentialsIndex + 1;
    await logIn(page);
    await page.goto(url);
    await page.waitForNetworkIdle();
    // waiting for the profile page rendered
    await page.waitForTimeout(3000);
    return await page.evaluate(getAboutInfo);
  }
  return data;
};
let userIdIndex = 0;
function scraptUserInformation(sliceIndex = 1198) {
  fs.readFile(path.join(__dirname, '/FB_Users.txt'), (err, data) => {
    if (err) console.log(err, 'error');
    const fbIds = data.toString().split(':').filter((item) => item.length === 15 && !!parseInt(item));
  });
}

connection.connect((err) => {
  if (err) throw err;
  connection.query('CREATE DATABASE IF NOT EXISTS FB_Users', (err, result) => {
    if (err) throw err;
    // create new table if not

    connection.changeUser({ database: 'FB_Users' }, (err) => {
      if (err) throw err;
      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${importantData.tableName} (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                                            fullName VARCHAR(60),
                                            friend VARCHAR(80),
                                            profileImgUrl VARCHAR(300),
                                            wallpaperImgUrl VARCHAR(300),
                                            photosUrls LONGTEXT,
                                            profileUrl VARCHAR(200),
                                            username VARCHAR(80),
                                            generalInfo TEXT,
                                            workAndEducationInfo TEXT,
                                            locationInfo TEXT,
                                            basicInfo TEXT,
                                            familyAndRelationshipInfo TEXT,
                                            extraDetailsInfo TEXT,
                                            importantEventsInfo TEXT
                                    )`;

      connection.query(createTableQuery, (error) => {
        if (error) throw error;
        scraptUserInformation();
      });
    });
  });
});

puppeteer.launch({
  headless: false, // put false to see how the bot work
}).then((browser) => {
  browser.newPage().then(async (page) => {
    const context = browser.defaultBrowserContext();
    //        URL                  An array of permissions
    context.overridePermissions('https://www.facebook.com', ['geolocation', 'notifications']);
    await page.goto(`${host}login`);
    await logIn(page);
    Promise.all(Array.from(new Set(fbIds.slice(sliceIndex, fbIds.length))).map(async (userId, userIndex) => async () => {
      userIdIndex = fbIds.indexOf(userId);
      const percent = ((userIdIndex + 1) * 100) / fbIds.length;
      console.log(`${percent.toFixed(2)}% completed`);
      console.log('User Index:', userIdIndex);
      const userUrlPhp = `https://www.facebook.com/profile.php?id=${userId}`;
      const userUrl = `https://www.facebook.com/${userId}`;
      await page.goto(userUrl);
      // await page.waitForNetworkIdle();
      // waiting for the profile page rendered
      await page.waitForTimeout(3000);

      const profileInfo = await page.evaluate(getProfileInfo);
      if (profileInfo === 0) {
        console.log(profileInfo, 'klk');
        return 0;
      }
      let infoUrls = generateInfoPages(profileInfo.username);
      if (parseInt(profileInfo.username)) {
        infoUrls = generateInfoPages(profileInfo.username, true);
      }

      await page.waitForSelector(`a[href='${infoUrls.about}']`, { timeout: 100000 });
      await page.click(`a[href='${infoUrls.about}']`);
      await page.waitForTimeout(2000);
      let generalInfoData = await page.evaluate(getAboutInfo);
      generalInfoData = await checkIfBlocked(generalInfoData, page, infoUrls.about);

      return {
        ...profileInfo,
      };
    })).then(async (res) => {
      for (const fn of res) {
        const data = await fn();
        if (data) {
          insertUser(data);
        }
        console.log('recopiled info:', data);
      }
    }).catch(async (err) => {
      await browser.close();
      console.log(userIdIndex, err);
      scraptUserInformation(userIdIndex);
    });
  });
});
