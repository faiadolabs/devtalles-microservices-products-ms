import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) { };

  async create(createProductDto: CreateProductDto) {

    // console.log({createProductDto});

    const product = await this.prisma.product.create({
      data: createProductDto,
    })

    return product;
  }

  async findAll(paginationDto: PaginationDto) {

    const { page = 1, limit = 10 } = paginationDto;

    const totalPages = await this.prisma.product.count({ where: { avaiable: true } });
    const lastPage = Math.ceil(totalPages / limit);

    const products = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { avaiable: true }
    });

    return {
      data: products,
      meta: {
        page,
        limit,
        totalPages,
        lastPage,
      }
    };
  }

  async findOne(id: number) {
    // console.log(id)
    const product = await this.prisma.product.findFirst({
      where: { id, avaiable: true }
    })

    if ((!product)) {
      throw new RpcException(`Product with id #${id} not found`)
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    // Renombro el id para separarlo de la data porque no me interesa actualizarlo ni usarlo
    const { id:__, ...data} = updateProductDto

    // Si no lanza exception se asegura que exista
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: data
    });
  }

  async remove(id: number) {

    // Si no lanza exception se asegura que exista
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        avaiable: false
      }
    });
  }
}
