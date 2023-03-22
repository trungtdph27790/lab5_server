const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        console.log(fileName);

        let arr = fileName.split('.');
        let newFilename = arr[0] + '-' + Date.now() + '-' + arr[1];
         
        cb(null,newFilename);
    }
})

var storageChange = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'myFile')
    },
    filename: function (req, file, cb) {

        let fileName = file.originalname;
        let arr = fileName.split('.');
        if (arr[1] == 'jpeg') {
            let newFileName = arr[0] + '-' + Date.now() + '.' + arr[1];
            cb(null, newFileName);
        }else{
            let newFileName = arr[0] + '-' + Date.now() + '.' + 'jpeg';
            cb(null, newFileName);
        }
    }
})



var upload = multer({ storage: storage })
var uploadChangle = multer({ storage: storageChange, limits: { fileSize: 10 * 1024 * 1024 } })
const upFile = uploadChangle.single('myFile');
const upFiles = upload.array('myFiles', 12);
const upImage = upload.single('myImage');

// app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
//     const file = req.file
//     if (!file) {
//         const error = new Error('Please upload a file')
//         error.httpStatusCode = 400
//         return next(error)
//     }
//     res.send(file)
// })

app.post('/uploadfile', function (req, res) {
    upFile(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Một lỗi của Multer xảy ra khi upload.
            res.send('Lỗi, không thành công')
            console.log(err);
        } else if (err) {
            // Một lỗi không xác định xảy ra khi upload.
            res.send('UploadFile không thành công')
            console.log(err);

        } else {
            // Mọi thứ khác chạy ok.
            res.send(req.file)
        }
    });
});

//Uploading multiple files
// app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
//     const files = req.files
//     if (!files) {
//         const error = new Error('Please choose files')
//         error.httpStatusCode = 400
//         return next(error)
//     }
//     res.send(files)
// })

//Uploading multiple files
app.post('/uploadmultiple', function (req, res) {
    upFiles(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Một lỗi của Multer xảy ra khi upload.
            // res.send('Lỗi, không thành công')
            res.send(err)
        } else if (err) {
            // Một lỗi không xác định xảy ra khi upload.
            // res.send('UploadFile không thành công')
            res.send(err)

        } else {
            // Mọi thứ khác chạy ok.
            res.send(req.files)
        }
    });
});

//Uploading file image
app.post('/upload/photo', function (req, res) {
    upImage(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Một lỗi của Multer xảy ra khi upload.
            console.log(err);
            res.send('Lỗi, không thành công')
        } else if (err) {
            // Một lỗi không xác định xảy ra khi upload.
            res.send('UploadFile không thành công')
        } else {
            // Mọi thứ khác chạy ok.
            res.send(req.file)
        }
    });
});




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});