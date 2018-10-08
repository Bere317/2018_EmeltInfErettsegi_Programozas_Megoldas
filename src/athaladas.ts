export class Athaladas{
    private _Ido: Date = new Date();
    public get Ido() { return this._Ido; }
    public set Ido(value: Date) { this._Ido = value; }

    private _Azon: number=101;
    public get Azon() { return this._Azon; }
    public set Azon(value: number) { this._Azon = value; }

    private _Irany: string="";
    public get Irany() { return this._Irany}
    public set Irany(value: string) {this._Irany=value;}

    /** 
     * @param {string} sor - A forrás-file egy sora
     * @constructor
    */

constructor (sor:string) 
{ 
    let m: string[] = sor.split(" ");
    let Ora : number = parseInt(m[0]);
    let Perc : number = parseInt(m[1]);
    this._Ido.setHours(Ora,Perc,0);
    this._Azon= parseInt(m[2]);
    this._Irany=m[3];
}

}