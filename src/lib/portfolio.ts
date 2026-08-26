export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  problem: string;
  result: string;
  client: string;
  link: string;
}

export const SEED_PORTFOLIO: PortfolioProject[] = [
  {
    id: "pf-1",
    name: "Dashboard de vendas multi-loja",
    description: "Painel executivo consolidando vendas de 12 lojas em tempo real.",
    technologies: ["Power BI", "DAX", "SQL Server"],
    problem: "O cliente não tinha visibilidade consolidada das vendas entre as lojas.",
    result: "Redução de 70% no tempo de fechamento mensal do relatório gerencial.",
    client: "Rede Bomdia",
    link: "",
  },
  {
    id: "pf-2",
    name: "Automação de conciliação bancária",
    description: "Script em Python que concilia extratos bancários com lançamentos contábeis.",
    technologies: ["Python", "Pandas", "Automação"],
    problem: "Conciliação manual levava mais de 8 horas por semana.",
    result: "Processo reduzido para 15 minutos, rodando automaticamente toda segunda-feira.",
    client: "Escritório Lumen",
    link: "",
  },
  {
    id: "pf-3",
    name: "API de pedidos para e-commerce",
    description: "API REST para gestão de pedidos, integrada ao ERP do cliente.",
    technologies: ["Node.js", "PostgreSQL", "Docker"],
    problem: "O e-commerce não tinha integração automática com o estoque do ERP.",
    result: "Zero divergência de estoque desde o lançamento, 3 meses em produção.",
    client: "Loja Fácil",
    link: "",
  },
];
