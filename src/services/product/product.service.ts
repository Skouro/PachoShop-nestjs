import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IProduct } from '../../interfaces/i-product.interface';
import { InjectModel } from '@nestjs/mongoose';
import { BSONRegExp } from 'bson';

@Injectable()
export class ProductService {
  // @ts-ignore
  constructor(@InjectModel('Product') private  productModel: Model) {
  }

  async addProduct(product1: IProduct) {
    const newProduct = new this.productModel(product1);
    return await newProduct.save().catch(reason => {
      throw  new HttpException({ error: reason }, HttpStatus.BAD_REQUEST);
    });
  }

  async getProducts() {
    return await this.productModel.find({ state: true });
  }

  async getOne(id?, name?) {
    return await this.productModel.findOne({ $or: [{ id }, { name }], state: true });
  }

  async upadte(product: IProduct) {
    let result;
    let exception;
    await this.productModel.findOneAndUpdate({ id: product.id, state: true }, product, (err, product1) => {
      if (err) {
        exception = new HttpException({ error: err }, HttpStatus.BAD_REQUEST);
      } else if (!product1) {
        exception = new HttpException({ error: `No se ha encontrado el producto con el id ${product.id}` }, HttpStatus.BAD_REQUEST);
      } else {
        result = product1;
      }
    });
    return result == null ? exception : result;
  }

  async search(text) {
    console.log(text);
    const Regex = new RegExp(`${text}`, 'ig');
    return await this.productModel.find({ name: { $regex: Regex }, state: true }, (err, res) => {
      // console.log(res);
    });
  }

  async delete(id) {
    let result;
    let exception;
    return await this.productModel.findOneAndUpdate({ id, state: true }, { state: false }, (err, product1) => {
      if (err) {
        exception = new HttpException({ error: err }, HttpStatus.BAD_REQUEST);
      } else if (!product1) {
        exception = new HttpException({ error: `No se ha encontrado el producto con el id ${id}` }, HttpStatus.BAD_REQUEST);
      } else {
        result = product1;
      }
    });

  }

  async setImage(id, img) {
    let result;
    let exception;
    await this.productModel.findOneAndUpdate({ id }, { image: img }, (err, res) => {
      if (err) {
        exception = new HttpException({ error: err }, HttpStatus.BAD_REQUEST);
      } else if (!res) {
        exception = new HttpException({ error: `No se ha encontrado el producto con el id ${id}` }, HttpStatus.BAD_REQUEST);
      } else {
        result = res;
      }
    });
    return result == null ? exception : result;
  }
}
