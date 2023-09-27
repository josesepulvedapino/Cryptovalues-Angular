import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Criptomoneda {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  criptomonedas: Criptomoneda[] = [];
  titulos: string[] = [
    '#',
    'Criptomoneda',
    'Precio Actual (USD)',
    'Cambio 24hrs',
    'Volumen total',
  ];
  buscarTexto: string = '';
  criptomonedasFiltradas: Criptomoneda[] = [];
  precioAscendente: boolean = false;
  cambioAscendente: boolean = false;

  constructor(private http: HttpClient) {}

  buscarCriptomoneda() {
    this.criptomonedasFiltradas = this.criptomonedas.filter(
      (criptomoneda) =>
        criptomoneda.name
          .toLocaleLowerCase()
          .includes(this.buscarTexto.toLocaleLowerCase()) ||
        criptomoneda.symbol
          .toLocaleLowerCase()
          .includes(this.buscarTexto.toLocaleLowerCase())
    );
  }

  ngOnInit() {
    this.http
      .get<Criptomoneda[]>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      )
      .subscribe(
        (resp) => {
          this.criptomonedas = resp;
          this.criptomonedasFiltradas = resp;
        },
        (error) => console.log(error)
      );
  }

  filtrarPorPrecio() {
    if (this.precioAscendente) {
      this.criptomonedasFiltradas = this.criptomonedasFiltradas.sort((a, b) => {
        if (a.current_price < b.current_price) {
          return 1;
        }
        if (a.current_price > b.current_price) {
          return -1;
        }
        return 0;
      });
    }
    if (!this.precioAscendente) {
      this.criptomonedasFiltradas = this.criptomonedasFiltradas.sort((a, b) => {
        if (a.current_price > b.current_price) {
          return 1;
        }
        if (a.current_price < b.current_price) {
          return -1;
        }
        return 0;
      });
    }
    this.precioAscendente = !this.precioAscendente;
  }

  filtrarPorCambio() {
    if (this.precioAscendente) {
      this.criptomonedasFiltradas = this.criptomonedasFiltradas.sort((a, b) => {
        if (a.price_change_percentage_24h < b.price_change_percentage_24h) {
          return 1;
        }
        if (a.price_change_percentage_24h > b.price_change_percentage_24h) {
          return -1;
        }
        return 0;
      });
    }
    if (!this.precioAscendente) {
      this.criptomonedasFiltradas = this.criptomonedasFiltradas.sort((a, b) => {
        if (a.price_change_percentage_24h > b.price_change_percentage_24h) {
          return 1;
        }
        if (a.price_change_percentage_24h < b.price_change_percentage_24h) {
          return -1;
        }
        return 0;
      });
    }
    this.precioAscendente = !this.precioAscendente;
  }
}
