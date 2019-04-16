import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ProductService } from '../../services/product/product.service';

const pngFileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png') {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    },
    ),
  )
  addProduct(@Body() body, @UploadedFile() file) {
    console.log('body', body);
    return this.productService.addProduct(body);
  }

  @Get()
  getAll() {
    return this.productService.getProducts();
  }

  @Get('/image/:image')
  getImage(@Res() res, @Param('image')img) {
    const pathImagen = path.resolve(__dirname, `../../../uploads/${img}`);
    if (fs.existsSync(pathImagen)) {
      res.sendFile(pathImagen);
    } else {
      const noImagePath = path.resolve(__dirname, '../../assets/no-image.jpg');
      res.sendFile(noImagePath);
    }
  }

  @Get(':id')
  getOne(@Param('id') id) {
    return this.productService.getOne(id);
  }

  @Put()
  async update(@Body() body) {
    return await this.productService.upadte(body);
  }

  @Get('search/:text')
  async seach(@Param('text') text) {
    return await this.productService.search(text);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.productService.delete(id);
  }

  @Put('upload/:id')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${file.originalname}`);
        },
      }),
    },
    ),
  )
// { fileFilter: pngFileFilter }
 async uploadFile(@UploadedFile() file, @Param('id') id) {
   return  await this.productService.setImage(id, file.originalname);
    // console.log('id', id);
    // console.log(file.originalname);
    // return 'yess';
    // files.console.log(files);
  }
}
