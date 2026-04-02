// Define, qué información, a la hora de crear un producto,

import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

// estoy esperando.
export class CreateProductDto {

    @IsString()
    public name:string;

    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Min(0)
    @Type( () => Number )
    public price:number;

}
