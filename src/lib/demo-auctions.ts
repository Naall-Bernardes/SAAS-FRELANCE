/**
 * Dataset de demonstração para o módulo Leilões (Imóveis e Veículos).
 *
 * Os conectores reais (ver src/lib/auction-connectors/) ainda não
 * conseguem puxar dados ao vivo da Caixa e do Leilo — ambos os sites são
 * aplicações client-side/wizard sem endpoint público estável (ver os
 * comentários em caixa.ts e leilo.ts). Até esses conectores serem
 * finalizados com um navegador headless, estas telas usam dados de
 * demonstração com a mesma forma que os dados reais teriam.
 */

export type ImovelCategoria = "Casa" | "Apartamento" | "Terreno" | "Comercial" | "Rural";
export type ImovelModalidade =
  | "Venda Online"
  | "Leilão SFI - Edital Único"
  | "Licitação Aberta"
  | "Exercício de Direito de Preferência"
  | "Compra Direta";

export interface DemoImovel {
  id: string;
  title: string;
  city: string;
  state: string;
  neighborhood: string;
  category: ImovelCategoria;
  areaM2: number;
  bedrooms?: number;
  evaluationValue: number;
  firstBidValue: number;
  secondBidValue?: number;
  discountPct: number;
  modality: ImovelModalidade;
  occupied: boolean;
  auctionDate: Date;
  description: string;
  url: string;
}

export type VeiculoCategoria = "Carro" | "Moto" | "Pesado" | "Utilitário";
export type VeiculoOrigem = "Recuperado de Financiamento" | "Recuperado de Seguradora" | "Particular" | "Leiloshop";

export interface DemoVeiculo {
  id: string;
  title: string;
  brand: string;
  category: VeiculoCategoria;
  year: string;
  km: number;
  state: string;
  city: string;
  origin: VeiculoOrigem;
  fipeValue: number;
  currentBidValue: number;
  hasKey: boolean;
  photosCount: number;
  auctionDate: Date;
  description: string;
  url: string;
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 86_400_000);
}

export const ESTADOS = ["SP", "RJ", "MG", "PR", "GO", "BA", "RS", "PE"] as const;
export const IMOVEL_CATEGORIAS: ImovelCategoria[] = ["Casa", "Apartamento", "Terreno", "Comercial", "Rural"];
export const IMOVEL_MODALIDADES: ImovelModalidade[] = [
  "Venda Online",
  "Leilão SFI - Edital Único",
  "Licitação Aberta",
  "Exercício de Direito de Preferência",
  "Compra Direta",
];
export const VEICULO_CATEGORIAS: VeiculoCategoria[] = ["Carro", "Moto", "Pesado", "Utilitário"];
export const VEICULO_ORIGENS: VeiculoOrigem[] = [
  "Recuperado de Financiamento",
  "Recuperado de Seguradora",
  "Particular",
  "Leiloshop",
];

export const DEMO_IMOVEIS: DemoImovel[] = [
  {
    id: "im-1",
    title: "Apartamento 2 quartos no Tatuapé",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Tatuapé",
    category: "Apartamento",
    areaM2: 58,
    bedrooms: 2,
    evaluationValue: 420_000,
    firstBidValue: 268_000,
    secondBidValue: 210_000,
    discountPct: 50,
    modality: "Venda Online",
    occupied: false,
    auctionDate: daysFromNow(12),
    description: "Apartamento desocupado, matrícula sem ônus registrado, 1 vaga de garagem, prédio com elevador.",
    url: "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnimovel=demo-im-1",
  },
  {
    id: "im-2",
    title: "Casa térrea 3 quartos em Contagem",
    city: "Contagem",
    state: "MG",
    neighborhood: "Eldorado",
    category: "Casa",
    areaM2: 120,
    bedrooms: 3,
    evaluationValue: 310_000,
    firstBidValue: 217_000,
    discountPct: 30,
    modality: "Leilão SFI - Edital Único",
    occupied: true,
    auctionDate: daysFromNow(6),
    description: "Imóvel ocupado pelo antigo mutuário — comprador deve providenciar ação de imissão na posse.",
    url: "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnimovel=demo-im-2",
  },
  {
    id: "im-3",
    title: "Cobertura duplex na Barra da Tijuca",
    city: "Rio de Janeiro",
    state: "RJ",
    neighborhood: "Barra da Tijuca",
    category: "Apartamento",
    areaM2: 145,
    bedrooms: 3,
    evaluationValue: 980_000,
    firstBidValue: 686_000,
    secondBidValue: 588_000,
    discountPct: 40,
    modality: "Venda Online",
    occupied: false,
    auctionDate: daysFromNow(20),
    description: "Cobertura desocupada com 2 vagas, condomínio com lazer completo. IPTU e condomínio em dia.",
    url: "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnimovel=demo-im-3",
  },
  {
    id: "im-4",
    title: "Terreno comercial na Av. T-63",
    city: "Goiânia",
    state: "GO",
    neighborhood: "Setor Bueno",
    category: "Terreno",
    areaM2: 450,
    evaluationValue: 850_000,
    firstBidValue: 595_000,
    discountPct: 30,
    modality: "Licitação Aberta",
    occupied: false,
    auctionDate: daysFromNow(28),
    description: "Terreno plano em avenida comercial de alto fluxo, esquina, pronto para incorporação.",
    url: "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnimovel=demo-im-4",
  },
  {
    id: "im-5",
    title: "Casa geminada 2 quartos em Canoas",
    city: "Canoas",
    state: "RS",
    neighborhood: "Niterói",
    category: "Casa",
    areaM2: 72,
    bedrooms: 2,
    evaluationValue: 235_000,
    firstBidValue: 152_750,
    secondBidValue: 117_500,
    discountPct: 35,
    modality: "Venda Online",
    occupied: true,
    auctionDate: daysFromNow(9),
    description: "Ocupado. Débitos de condomínio inexistentes (imóvel não tem condomínio). IPTU com pendência a apurar.",
    url: "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnimovel=demo-im-5",
  },
  {
    id: "im-6",
    title: "Sala comercial no centro de Curitiba",
    city: "Curitiba",
    state: "PR",
    neighborhood: "Centro",
    category: "Comercial",
    areaM2: 42,
    evaluationValue: 195_000,
    firstBidValue: 136_500,
    discountPct: 30,
    modality: "Compra Direta",
    occupied: false,
    auctionDate: daysFromNow(15),
    description: "Sala desocupada em edifício comercial consolidado, próxima ao Marco Zero, sem ônus registrado.",
    url: "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnimovel=demo-im-6",
  },
];

export const DEMO_VEICULOS: DemoVeiculo[] = [
  {
    id: "ve-1",
    title: "JEEP/RENEGADE LONGITUDE T270",
    brand: "Jeep",
    category: "Carro",
    year: "24/24",
    km: 27_140,
    state: "GO",
    city: "Goiânia",
    origin: "Recuperado de Financiamento",
    fipeValue: 138_000,
    currentBidValue: 92_000,
    hasKey: true,
    photosCount: 29,
    auctionDate: daysFromNow(3),
    description: "Recuperado de financiamento, sem sinistro registrado, chave reserva disponível.",
    url: "https://leilo.com.br/lote/demo-ve-1",
  },
  {
    id: "ve-2",
    title: "FIAT/STRADA VOLCANO",
    brand: "Fiat",
    category: "Utilitário",
    year: "24/24",
    km: 42_087,
    state: "GO",
    city: "Goiânia",
    origin: "Recuperado de Financiamento",
    fipeValue: 118_000,
    currentBidValue: 79_500,
    hasKey: true,
    photosCount: 39,
    auctionDate: daysFromNow(3),
    description: "Sem chave reserva, pequenos riscos na lataria conforme fotos do laudo.",
    url: "https://leilo.com.br/lote/demo-ve-2",
  },
  {
    id: "ve-3",
    title: "HYUNDAI/CRETA 1.0 TA COMFORT",
    brand: "Hyundai",
    category: "Carro",
    year: "24/25",
    km: 93_529,
    state: "CE",
    city: "Fortaleza",
    origin: "Recuperado de Seguradora",
    fipeValue: 105_000,
    currentBidValue: 36_100,
    hasKey: false,
    photosCount: 27,
    auctionDate: daysFromNow(5),
    description: "Sinistro de médio porte reparado — recomendado laudo mecânico antes do lance final.",
    url: "https://leilo.com.br/lote/demo-ve-3",
  },
  {
    id: "ve-4",
    title: "NISSAN/VERSA ADVANCE (4P)",
    brand: "Nissan",
    category: "Carro",
    year: "25/26",
    km: 40_461,
    state: "GO",
    city: "Goiânia",
    origin: "Recuperado de Financiamento",
    fipeValue: 98_000,
    currentBidValue: 69_000,
    hasKey: true,
    photosCount: 26,
    auctionDate: daysFromNow(1),
    description: "Recuperado de financiamento, revisões em dia conforme manual, sem sinistro.",
    url: "https://leilo.com.br/lote/demo-ve-4",
  },
  {
    id: "ve-5",
    title: "MITSUBISHI/TRITON SPORT HPE",
    brand: "Mitsubishi",
    category: "Pesado",
    year: "22/23",
    km: 61_200,
    state: "PA",
    city: "Belém",
    origin: "Recuperado de Financiamento",
    fipeValue: 210_000,
    currentBidValue: 55_500,
    hasKey: true,
    photosCount: 30,
    auctionDate: daysFromNow(4),
    description: "Cabine dupla 4x4, pneus com mais de 60% de vida útil, sem indícios de batida estrutural.",
    url: "https://leilo.com.br/lote/demo-ve-5",
  },
  {
    id: "ve-6",
    title: "YAMAHA/YBR 150 FACTOR ED",
    brand: "Yamaha",
    category: "Moto",
    year: "23/24",
    km: 18_400,
    state: "GO",
    city: "Goiânia",
    origin: "Recuperado de Financiamento",
    fipeValue: 16_500,
    currentBidValue: 8_900,
    hasKey: true,
    photosCount: 14,
    auctionDate: daysFromNow(2),
    description: "Moto de baixa cilindrada, ideal para revenda rápida, poucos riscos de uso.",
    url: "https://leilo.com.br/lote/demo-ve-6",
  },
];
