const fs = require('fs');

const saveImg = (imgBase64,name) => {
    // This regex removes the data URI prefix for various image types.
    const imageBuffer = Buffer.from(imgBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    if(!fs.existsSync("images/"))fs.mkdirSync("images/")
    fs.writeFile(`images/${name}.png`, imageBuffer, function(err) {
        if (err) console.error('Error saving image:', err);
        else {/*'Image saved successfully!'*/}
    });
};

const deleteImg = (name) => {
    fs.unlink(`images/${name}.png`, function(err) {
        if (err) console.error('Error eleting image:', err);
        else {/*'Image delete successfully!'*/}
    });
};
module.exports = {saveImg,deleteImg};