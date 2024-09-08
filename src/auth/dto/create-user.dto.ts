import { IsEmail, IsNotEmpty, IsNumberString, IsString, IsStrongPassword } from "class-validator";


export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;

    @IsNumberString()
    @IsNotEmpty()
    phoneNumber: string;
}