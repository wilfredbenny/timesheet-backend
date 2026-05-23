import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll(
    currentUserId: string,
  ) {

    const currentUser =
      await this.prisma.users.findUnique({

        where: {
          id: BigInt(currentUserId),
        },
      });

    if (!currentUser) {

      return [];
    }

    /*
      ADMIN
      -> all users
    */

    if (currentUser.role === 'ADMIN') {

      return this.prisma.users.findMany({

        select: {
          id: true,
          employee_code: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          is_active: true,
          created_at: true,
          manager_id: true,
        },
      });
    }

    /*
      MANAGER
      -> only employees reporting to him
    */

    if (currentUser.role === 'MANAGER') {

      return this.prisma.users.findMany({

        where: {
          manager_id: BigInt(currentUserId),
        },

        select: {
          id: true,
          employee_code: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          is_active: true,
          created_at: true,
          manager_id: true,
        },
      });
    }

    /*
      EMPLOYEE
      -> only own profile
    */

    return this.prisma.users.findMany({

      where: {
        id: BigInt(currentUserId),
      },

      select: {
        id: true,
        employee_code: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        manager_id: true,
      },
    });
  }

  async create(
    createUserDto: CreateUserDto
  ) {

    try {

      console.log(createUserDto);

      const hashedPassword =
        await bcrypt.hash(
          createUserDto.password,
          10
        );

      const data = {

        employee_code:
          createUserDto.employee_code,

        first_name:
          createUserDto.first_name,

        last_name:
          createUserDto.last_name,

        email:
          createUserDto.email,

        password:
          hashedPassword,

        role:
          createUserDto.role,

        manager_id:
          createUserDto.reporting_manager_id
            ? BigInt(
                createUserDto.reporting_manager_id
              )
            : null
      };

      console.log(data);

      const user =
        await this.prisma.users.create({

          data
        });

      console.log(user);

      return user;

    } catch (error: any) {

      console.log(
        'FULL ERROR:',
        error
      );

      console.log(
        'MESSAGE:',
        error?.message
      );

      console.log(
        'META:',
        error?.meta
      );

      throw error;
    }
  }
}
