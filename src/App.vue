<template>
  <div id="app">
    <p>
Linkek: <a href="ajto.txt" download>A feladat forrásfájlja - ajto.txt</a><br>
<a href="e_inf_18maj_fl.pdf" download>Emelt informatika érettségi 2018 feladatsor</a><br>
<a href="e_inffor_18maj_fl.zip" download>Emelt informatika érettségi 2018 forrásfájlok</a><br>
<a href="https://github.com/nitslaszlo/ErettsegiHianyzasokTsVueJs" target="_blank">Forrás(github)</a>
    </p>
    <txt-olvaso v-on:load="forras = $event" title="Kérem töltse fel a forrás (ajto.txt) állományt!" />
    <div id="megoldas" v-show="mutat">
<p>1. feladat:<br>Az adatok beolvasása</p>

<p>2. feladat:<br>Az első érkező azonosítója: {{ElsoAthalado()}}<br>Az utolsó távozó azonosítója: {{UtolsoAthalado()}}
</p>

<!-- TODO -->
<p>3. feladat: Áthaladások száma színészenként <br>
<label for="AthaladasMutat">Mutassa</label>
<input type="checkbox" name="AthaladasMutat" value="Mutassa" v-model="mutatas"/>
 <span v-for="t in SzineszekAthaladasai()" :key="t"><br>{{t}}</span></p>

<p>4. feladat: A végén a társalgóban maradtak: <span v-for="t in KikMaradtak()" :key="t">{{t}} </span></p>

<p>5. feladat: Legtöbben például {{MikorVoltakLegtobben()}}-kor voltak bent.</p> 

<p>6. feladat: Adja meg a kért személy azonosítóját: <input type="number" v-model="azonosito" min="1" max="100" placeholder="1-100"/><br></p>
 <div v-show="azonositojo">
 <p>7. feladat: A kért személy az alábbi időpontokon tartózkodott bent:<br>
 <span v-for="t in MikorVoltBent()" :key="t"><br>{{t}}</span></p>
 <p>8. feladat: {{MennyitVoltBent()}} </p>
 </div>

</div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Athaladas } from "./athaladas";
import TxtOlvaso from "./components/TxtOlvaso.vue";

@Component({ components: { TxtOlvaso } })
export default class App extends Vue {
  private athaladasok: Athaladas[] = [];
  private forras: string = "";
  private mutat: boolean = false;
  private azonosito: number = 101;
  private szineszekathaladasai = new Array<number>(100);
  private mutatas: boolean = false;
  private azonositojo: boolean = false;

  @Watch("forras", { immediate: true, deep: true })
  onForrasChanged(val: string, oldVal: string) {
    if (val != "") {
      this.Feldolgoz();
    }
  }

  private Feldolgoz(): void {
    try {
      this.forras.split("\n").forEach(i => {
        let aktSor: string = i.trim();
        if (aktSor.length != 0) {
          this.athaladasok.push(new Athaladas(aktSor));
        }
      });
      this.mutat = true;
    } catch (error) {
      this.mutat = false;
      this.athaladasok = [];
      console.log(error);
      window.alert("Hibás forrás!");
    }
  }

  private ElsoAthalado(): number {
    if (this.athaladasok.length != 0) {
      return this.athaladasok[0].Azon;
    } else {
      return 101;
    }
  }

  private UtolsoAthalado(): number {
    let utolsoKi: number = 0;
    if (this.athaladasok.length != 0) {
      this.athaladasok.forEach(i => {
        if (i.Irany == "ki") utolsoKi = i.Azon;
      });
    }
    return utolsoKi;
  }

  /* 3. Feladat */
  private SzineszekAthaladasai(): string[] {
    let vissza = new Array<string>();
    let sor: string = "";
    if (this.mutatas) {
      if (this.athaladasok.length != 0) {
        for (let i = 0; i < 100; i++) {
          this.szineszekathaladasai[i] = 0;
        }

        for (let i = 0; i < this.athaladasok.length; i++) {
          this.szineszekathaladasai[this.athaladasok[i].Azon - 1]++;
        }

        for (let i = 0; i < this.szineszekathaladasai.length; i++) {
          if (this.szineszekathaladasai[i] != 0) {
            sor +=
              (i + 1).toString() +
              " " +
              this.szineszekathaladasai[i].toString();
            vissza.push(sor);
            sor = "";
          }
        }
      }
    }
    return vissza;
  }

  /* 4. Feladat */
  private KikMaradtak(): number[] {
    let kikmaradtak = new Array<number>();
    if (this.athaladasok.length != 0) {
      for (let i = 0; i < this.szineszekathaladasai.length; i++) {
        if (this.szineszekathaladasai[i] % 2 == 1) {
          kikmaradtak[kikmaradtak.length] = i + 1;
        }
      }
    }
    return kikmaradtak;
  }

  /* 5. Feladat */
  private MikorVoltakLegtobben(): string {
    let aktLetszam = 0;
    let maxLetszam = 0;
    let maxAthaladas: Athaladas = new Athaladas("0 0 0 be");
    if (this.athaladasok.length != 0) {
      this.athaladasok.forEach(i => {
        if (i.Irany == "be") aktLetszam++;
        else aktLetszam--;
        if (aktLetszam > maxLetszam) {
          maxLetszam = aktLetszam;
          maxAthaladas = i;
        }
      });
    }
    let eredmeny: string =
      maxAthaladas.Ido.getHours() + ":" + maxAthaladas.Ido.getMinutes();
    return eredmeny;
  }
  /* 7. Feladat */
  private MikorVoltBent(): string[] {
    if (this.azonosito > 0 && this.azonosito < 100) this.azonositojo = true;
    else this.azonositojo = false;
    let sor: string = "";
    let mikor = new Array<string>();
    let seged: number = 0;
    if (this.athaladasok.length != 0) {
      this.athaladasok.forEach(i => {
        if (i.Azon == this.azonosito) {
          if (seged % 2 == 0) {
            sor = sor + i.Ido.getHours() + ":" + i.Ido.getMinutes() + "-";
            seged++;
          } else {
            sor = sor + i.Ido.getHours() + ":" + i.Ido.getMinutes();
            seged++;
            mikor.push(sor);
            sor = "";
          }
        }
      });
    }
    if (seged % 2 == 1) {
      mikor.push(sor);
    }
    return mikor;
  }
  /* 8. Feladat */
  private MennyitVoltBent(): string {
    let TarsalgobanToltottIdo: number = 0;
    let aktualisBelepes: number = 0;
    let aktualisKilepes: number = 0;
    let megfigyeltidoszakvege = 15 * 60;

    let seged: number = 0;
    let mikor: string = "";
    if (this.athaladasok.length != 0) {
      this.athaladasok.forEach(i => {
        if (i.Azon == this.azonosito && i.Irany == "be") {
          aktualisBelepes = i.Ido.getHours() * 60 + i.Ido.getMinutes();
          seged++;
        }
        if (i.Azon == this.azonosito && i.Irany == "ki") {
          aktualisKilepes = i.Ido.getHours() * 60 + i.Ido.getMinutes();
          TarsalgobanToltottIdo += aktualisKilepes - aktualisBelepes;
          seged++;
        }
      });
    }
    if (seged % 2 != 0) {
      TarsalgobanToltottIdo += megfigyeltidoszakvege - aktualisBelepes;
      mikor =
        "A kért személy " +
        TarsalgobanToltottIdo +
        " percet töltött a társalgóban és a megfigyelt időszak végén még bent tartózkodott.";
    } else {
      mikor =
        "A kért személy " +
        TarsalgobanToltottIdo +
        " percet töltött a társalgóban.";
    }
    return mikor;
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
