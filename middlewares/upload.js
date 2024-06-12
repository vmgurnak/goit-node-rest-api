import path from 'node:path';
import multer from 'multer';
import crypto from 'node:crypto';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve('tmp'));
  },
  filename: function (req, file, cb) {
    console.log({ file });
    const extname = path.extname(file.originalname);
    console.log(extname);
    const basename = path.basename(file.originalname, extname);
    console.log(basename);
    const suffix = crypto.randomUUID();
    const filename = `${basename}-${suffix}${extname}`;

    console.log(filename);

    cb(null, filename);
  },
});

export default multer({ storage: storage });
