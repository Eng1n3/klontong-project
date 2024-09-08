import { IsEmail, IsString } from "class-validator";


export class CreateSuperuserDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}