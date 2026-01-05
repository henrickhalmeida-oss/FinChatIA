import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Lock, CalendarClock, Wallet, CreditCard, Tag, Calculator } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData, TransactionCategory, CATEGORY_LABELS, BankType, PaymentMethod } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ============================================================================
// 📚 1. O GRANDE DICIONÁRIO (MANTIDO COMPLETO)
// ============================================================================
const smartCategories: Array<{ keys: string[], category: TransactionCategory }> = [
  { 
    category: 'transporte',
    keys: [
      'uber', '99', 'taxi', 'indrive', 'black', 'pop', 'corrida', 'transporte',
      'gasolina', 'etanol', 'diesel', 'gnv', 'abasteci', 'posto', 'combustivel', 'tanque', 'aditivada',
      'onibus', 'busao', 'metro', 'trem', 'passagem', 'bilhete', 'top', 'recarga', 'transcol',
      'estacionamento', 'zona azul', 'pedagio', 'sem parar', 'veloe', 'conectcar', 'tag',
      'mecanico', 'oficina', 'revisao', 'oleo', 'filtro', 'pneu', 'balanceamento', 'alinhamento', 'bateria', 'funilaria', 'pintura', 'radiador',
      'ipva', 'licenciamento', 'multa', 'detran', 'emplacamento', 'dpvat',
      'carro', 'moto', 'veiculo', 'vistoria', 'lavar carro', 'lavajato', 'seguro auto', 'franquia', 'sinistro'
    ] 
  },
  { 
    category: 'saude',
    keys: [
      'farmacia', 'remedio', 'medicamento', 'drogaria', 'dipirona', 'dorflex', 'antibiotico', 'anticoncepcional',
      'medico', 'consulta', 'exame', 'laboratorio', 'ultrassom', 'raio x', 'ressonancia', 'checkup',
      'dentista', 'ortodontista', 'aparelho', 'clareamento', 'limpeza dental', 'canal', 'obturação',
      'convenio', 'unimed', 'plano de saude', 'amil', 'bradesco saude', 'sulamerica', 'notredame',
      'terapia', 'psicologo', 'psiquiatra', 'nutricionista', 'fisioterapia', 'quiropraxia', 'fono',
      'academia', 'smartfit', 'bluefit', 'crossfit', 'personal', 'natacao', 'pilates', 'yoga', 'musculacao',
      'suplemento', 'whey', 'creatina', 'vitamina', 'omega 3', 'pre treino',
      'barbeiro', 'cabelo', 'corte', 'salao', 'manicure', 'pedicure', 'unha', 'sobrancelha', 'micropigmentacao',
      'depilacao', 'estetica', 'botox', 'laser', 'massagem', 'harmonizacao', 'drenagem', 'limpeza de pele', 'preenchimento', 'silicone', 'lipo',
      'skin care', 'creme', 'perfume', 'cosmetico', 'sephora', 'boticario', 'natura', 'avon', 'maquiagem', 'protetor solar'
    ] 
  },
  { 
    category: 'alimentacao',
    keys: [
      'ifood', 'rappi', 'ze delivery', 'entrega', 'delivery', 'aiqfome',
      'restaurante', 'almoco', 'jantar', 'prato feito', 'self service', 'rodizio', 'marmita', 'pf', 'comida',
      'lanche', 'mc donalds', 'bk', 'burger king', 'subway', 'hamburguer', 'pizza', 'esfiha', 'habibs', 'kfc', 'taco', 'pastel',
      'mercado', 'supermercado', 'compras', 'assai', 'carrefour', 'pao de acucar', 'atacadao', 'dia', 'extra', 'sams club', 'tenda', 'mercadinho',
      'padaria', 'pao', 'cafe', 'leite', 'misto', 'sonho', 'baguete',
      'acai', 'sorvete', 'chocolate', 'doce', 'bolo', 'torta', 'brigadeiro',
      'bar ', 'cerveja', 'churrasco', 'breja', 'vinho', 'drink', 'happy hour', 'gin', 'vodka', 'whisky', 'balada',
      'sushi', 'temaki', 'japones', 'feirante', 'feira', 'hortifruti', 'sacolao', 'acougue', 'carne', 'frango', 'peixe'
    ] 
  },
  { 
    category: 'casa',
    keys: [
      'aluguel', 'condominio', 'iptu', 'seguro incendio', 'imobiliaria',
      'luz', 'energia', 'enel', 'cpfl', 'light', 'cemig', 'coelba', 'neoenergia',
      'agua', 'sabesp', 'esgoto', 'embasa', 'corsan', 'cedae',
      'internet', 'wifi', 'fibra', 'vivo', 'claro', 'tim', 'oi', 'net', 'recarga celular',
      'gas', 'botijao', 'encanado', 'comgas', 'naturgy',
      'faxina', 'diarista', 'limpeza', 'passadeira', 'lavanderia', 'dryclean',
      'reforma', 'material', 'tinta', 'cimento', 'telhado', 'piso', 'encanador', 'eletricista', 'marido de aluguel', 'pedreiro',
      'moveis', 'sofa', 'cama', 'mesa', 'cadeira', 'armario', 'guarda roupa',
      'eletro', 'geladeira', 'fogao', 'microondas', 'maquina de lavar', 'airfryer', 'liquidificador', 'alexa',
      'mercado livre', 'shopee', 'amazon', 'magalu', 'casas bahia', 'leroy merlin', 'tokstok', 'fast shop',
      'pet', 'racao', 'veterinario', 'banho e tosa', 'gato', 'cachorro', 'areia de gato', 'vacina pet', 'bravecto', 'petz', 'cobasi',
      'assinatura', 'streaming', 'tv', 'sky', 'directv', 'disney', 'netflix',
      'jardinagem', 'manutencao', 'dedetizacao', 'chaveiro'
    ] 
  },
  { 
    category: 'educacao',
    keys: [
      'faculdade', 'universidade', 'escola', 'colegio', 'mensalidade', 'matricula', 'rematricula',
      'curso', 'udemy', 'alura', 'hotmart', 'kiwify', 'ingles', 'espanhol', 'frances', 'kumon', 'wizard', 'fisks',
      'livro', 'ebook', 'kindle', 'saraiva', 'leitura', 'amazon books',
      'papelaria', 'material escolar', 'xerox', 'caderno', 'caneta', 'lapis', 'mochila', 'fardamento', 'uniforme', 'lancheira'
    ] 
  },
  { 
    category: 'lazer',
    keys: [
      'cinema', 'pipoca', 'ingresso', 'show', 'teatro', 'museu', 'exposicao',
      'netflix', 'spotify', 'prime video', 'disney', 'hbo', 'globoplay', 'youtube', 'appletv', 'paramount',
      'jogo', 'steam', 'playstation', 'xbox', 'nintendo', 'riot', 'valorant', 'skins', 'roblox', 'coins', 'v-bucks',
      'viagem', 'passagem aerea', 'hotel', 'airbnb', 'pousada', 'resort', 'passeio', 'cvc', 'decolar', '123milhas',
      'festa', 'balada', 'evento', 'clube', 'barzinho', 'praia', 'chacara', 'sitio',
      'presente', 'namoro', 'hobby', 'parque', 'instrumento', 'violao', 'camera',
      'roupa', 'camisa', 'camiseta', 'calca', 'vestido', 'tenis', 'sapato', 'bolsa', 'mochila',
      'zara', 'renner', 'c&a', 'riachuelo', 'shein', 'nike', 'adidas', 'puma', 'vans',
      'celular', 'iphone', 'samsung', 'xiaomi', 'motorola', 'fone', 'airpods', 'carregador', 'capinha', 'pelicula',
      'notebook', 'computador', 'mouse', 'teclado', 'gamer'
    ] 
  },
  { 
    category: 'salario',
    keys: [
      'salario', 'pagamento', 'adiantamento', 'vale', 'holerite', 'pro-labore',
      'freela', 'freelance', 'bico', 'servico', 'job', 'extra',
      'venda', 'comissao', 'lucro', 'faturamento', 'receita',
      '13', 'decimo', 'ferias', 'bonus', 'plr', 'participacao',
      'reembolso', 'devolucao', 'estorno', 'restituicao',
      'recebi', 'deposito', 'transferencia', 'caiu', 'tenho', 'possuo', 'guardado', 'achei', 'ganhei', 'faturei',
      'aposentadoria', 'pensao', 'mesada', 'aluguel recebido'
    ] 
  },
  { 
    category: 'investimento',
    keys: [
      'bitcoin', 'cripto', 'ethereum', 'binance', 'coinbase',
      'cdb', 'cdi', 'tesouro', 'selic', 'poupanca', 'lci', 'lca', 'cri', 'cra',
      'guardar', 'reserva', 'cofre', 'porquinho', 'caixinha',
      'acao', 'fundo', 'invest', 'corretora', 'rico', 'xp', 'nuinvest', 'inter invest', 'ion', 'btg', 'avenue',
      'aporte', 'dividendo', 'rendimento', 'fii', 'previdencia', 'vgbl', 'pgbl'
    ] 
  }
];

const wordsToRemove = [
  'gastei', 'paguei', 'comprei', 'assinei', 'fiz', 'um', 'pix', 'transferi', 'perdi', 'saida', 'saída', 'dei', 'enviei', 'pagar', 'trocar', 'fazer',
  'recebi', 'ganhei', 'caiu', 'pingou', 'depositei', 'entrada', 'vendi', 'lucro', 'pagaram', 'agendar', 'marcar', 'coloquei', 'botei', 'faturei', 'parcelei', 'dividi', 'acaba', 'termina',
  'tenho', 'possuo', 'guardado', 'banco', 'conta', 'dinheiro', 'grana', 'valor', 'reais', 'real', 'r$', 'conto', 'pila', 'mangos', 'paus', 'mil', 'foi', 'deu', 'ficou',
  'no', 'na', 'em', 'de', 'do', 'da', 'com', 'pelo', 'pela', 'para', 'pro', 'pra', 'a', 'o', 'uns', 'umas', 'meu', 'minha', 'nossa', 'e', 'que', 'ate', 'esse', 'essa'
];

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// ============================================================================
// 🔢 2. MOTOR MATEMÁTICO
// ============================================================================

interface PaymentDetails {
  installments: number;
  isRecurring: boolean;
  finalAmount: number;
  calculationMethod: 'divided' | 'multiplied' | 'fixed';
  feedback: string;
  date: Date;
}

function extractNumbers(text: string): number[] {
  const matches = text.match(/(?:R\$|\$)?\s*(\d+(?:[.,]\d{1,2})?)\s*k?|(?:^|\s)(\d+)k(?:\s|$)/gi);
  if (!matches) return [];
  
  return matches.map(raw => {
    let n = raw.toLowerCase().replace(/[r$\s]/g, '');
    if (n.includes('k')) {
      n = n.replace('k', '');
      return parseFloat(n.replace(',', '.')) * 1000;
    }
    if (n.includes(',') && n.includes('.')) n = n.replace('.', '').replace(',', '.');
    else if (n.includes(',')) n = n.replace(',', '.');
    return parseFloat(n);
  }).filter(n => !isNaN(n));
}

function analyzePayment(text: string, rawAmount: number): PaymentDetails {
  const clean = normalizeText(text);
  const now = new Date();
  const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  let installments = 1;
  let isRecurring = false;
  let finalAmount = rawAmount;
  let calculationMethod: 'divided' | 'multiplied' | 'fixed' = 'fixed';
  let feedback = '';
  let date = new Date();

  for (let i = 0; i < months.length; i++) {
    if (clean.includes(months[i])) {
      let targetYear = now.getFullYear();
      let targetMonth = i;
      if (targetMonth < now.getMonth()) targetYear++;
      date = new Date(targetYear, targetMonth, 5); 
      break;
    }
  }

  if (clean.includes('todo mes') || clean.includes('toda semana') || clean.includes('mensal') || clean.includes('assinatura') || clean.includes('fixo') || clean.includes('sempre')) {
    isRecurring = true;
    installments = 12;
    feedback = 'Recorrência mensal identificada.';
    return { installments, isRecurring, finalAmount, calculationMethod, feedback, date };
  }

  const explicitMatch = clean.match(/(\d+)\s*(?:x|vezes|parcelas)/);
  if (explicitMatch) {
    installments = parseInt(explicitMatch[1]);
    if (text.toLowerCase().includes(' de ') && text.toLowerCase().includes('parcelas')) {
       calculationMethod = 'fixed';
       feedback = `${installments} parcelas de ${formatCurrency(finalAmount)}.`;
    } else {
       calculationMethod = 'divided';
       finalAmount = rawAmount / installments;
       feedback = `Total dividido em ${installments}x de ${formatCurrency(finalAmount)}.`;
    }
    return { installments, isRecurring, finalAmount, calculationMethod, feedback, date };
  }

  return { installments, isRecurring, finalAmount, calculationMethod, feedback, date };
}

// --------------------------------------------------------
// 🔍 3. ANALISADOR PRINCIPAL
// --------------------------------------------------------
function parseTransaction(text: string): { 
    amount: number; category: TransactionCategory; description: string; bank: BankType; 
    type: 'income' | 'expense'; date: Date; originalBankName?: string; 
    installments: number; isRecurring: boolean; feedback: string; 
    paymentMethod: PaymentMethod 
} | null {
  const cleanText = normalizeText(text);
  const numbers = extractNumbers(text);
  let amount = 0;
  if (numbers.length > 0) amount = Math.max(...numbers);
  if (amount === 0) return null;

  const payment = analyzePayment(text, amount);

  let type: 'income' | 'expense' = 'expense';
  const incomeKeywords = ['receber', 'recebi', 'ganhei', 'caiu', 'salario', 'venda', 'lucro', 'entrada', 'reembolso', 'freela', 'freelance', 'pagamento'];
  
  if (incomeKeywords.some(w => cleanText.includes(w))) {
    type = 'income';
  }

  let paymentMethod: PaymentMethod = 'debit'; 
  const creditKeywords = ['cartao', 'credito', 'fatura', 'parcelado', 'parcela', 'dividido'];
  if (payment.installments > 1 || creditKeywords.some(w => cleanText.includes(w))) {
      paymentMethod = 'credit';
  }
  if (type === 'income') paymentMethod = 'debit';

  let category: TransactionCategory = type === 'income' ? 'salario' : 'outros';
  let detectedKeyword = '';
  for (const group of smartCategories) {
    const found = group.keys.find(key => cleanText.includes(key));
    if (found) { category = group.category; detectedKeyword = found; break; }
  }

  let bank: BankType = 'itau'; 
  if (cleanText.includes('nubank')) bank = 'nubank';

  let description = text.replace(/(?:R\$|\$)?\s*\d+(?:[.,]\d{1,2})?k?/gi, '');
  wordsToRemove.forEach(word => description = description.replace(new RegExp(`\\b${word}\\b`, 'gi'), ''));
  description = description.replace(/\s+/g, ' ').trim();
  if (description.length < 3) description = detectedKeyword || (type === 'income' ? 'Entrada' : 'Saída');

  return { 
    amount: payment.finalAmount, category, description, bank, type, date: payment.date, 
    installments: payment.installments, isRecurring: payment.isRecurring, 
    feedback: payment.feedback, paymentMethod 
  };
}

// ============================================================================
// 🖥️ COMPONENTE VISUAL (OTIMIZADO MOBILE)
// ============================================================================
export default function ChatIA() {
  const { user } = useAuth();
  const { addTransaction, totalBalance } = useData();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Olá! Sou seu Assistente de Gestão Financeira.\n\nEstou aqui para simplificar seu controle patrimonial. Você pode registrar despesas, entradas ou tirar dúvidas sobre seu saldo apenas conversando comigo.\n\nComo posso ajudar na sua organização hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || user?.plan !== 'pro') return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 800));
    const lowerInput = normalizeText(currentInput);
    let response = '';

    if (lowerInput.includes('saldo')) {
      response = `💰 Seu saldo atual consolidado é de **${formatCurrency(totalBalance)}**.`;
    } 
    else if (lowerInput.includes('ajuda')) {
      response = '🤝 **Como posso ajudar:**\n\nVocê pode me enviar comandos naturais como:\n• *"Gastei 180 no barbeiro"* (Débito)\n• *"Minha fatura de Fevereiro é 345"* (Agendamento)\n• *"Qual meu saldo atual?"* (Consulta)';
    }
    else {
      const parsed = parseTransaction(currentInput);
      if (parsed) {
        addTransaction({
          description: parsed.description,
          amount: parsed.amount,
          type: parsed.type,
          category: parsed.category,
          bank: parsed.bank,
          date: parsed.date, 
          repeatMonths: parsed.installments,
          isInstallment: !parsed.isRecurring,
          paymentMethod: parsed.paymentMethod 
        });

        const icon = parsed.paymentMethod === 'credit' ? '💳 (Crédito/Fatura)' : (parsed.type === 'income' ? '💰 (Receita/Saldo)' : '💵 (Débito Direto)');
        const dateDisplay = parsed.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        response = `✅ **${parsed.type === 'income' ? 'Entrada registrada' : 'Lançamento realizado'} com sucesso!**\n\n` +
                   `Já processei as informações para o período de **${dateDisplay}**:\n\n` +
                   `💰 **Montante:** ${formatCurrency(parsed.amount)}\n` +
                   `⚙️ **Método:** ${icon}\n` +
                   `📝 **Descrição:** ${parsed.description}\n` +
                   `📂 **Categoria:** ${CATEGORY_LABELS[parsed.category]}`;
      } else {
        response = '🤔 Compreendi sua intenção, mas preciso de um valor numérico claro para processar o lançamento. Poderia repetir informando o valor?';
      }
    }

    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: new Date() }]);
    setIsTyping(false);
  };

  return (
    <div className="h-[calc(100dvh-10rem)] md:h-[calc(100vh-8rem)] flex flex-col px-1">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-4 md:mb-6 flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center neon-border">
          <Sparkles className="w-5 h-5 md:w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold truncate">Consultor Estratégico</h1>
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase font-bold tracking-widest">IA Inteligente</p>
        </div>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex-1 glass-card flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/20"><Bot className="w-4 h-4 text-primary" /></div>}
                <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-secondary rounded-bl-sm border border-white/5'}`}>
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {user?.plan !== 'pro' && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-10 p-6">
             <div className="text-center bg-secondary/50 p-6 rounded-3xl border border-white/10 shadow-2xl">
                <Lock className="mx-auto mb-4 w-10 h-10 text-primary opacity-50"/>
                <h3 className="text-lg font-bold mb-4">Acesso PRO Necessário</h3>
                <Button onClick={() => navigate('/assinatura')} className="w-full py-6 font-bold">Assinar Agora</Button>
             </div>
          </div>
        )}

        <div className="p-3 md:p-4 border-t border-border/50 flex gap-2 md:gap-3 bg-black/20">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Gastei 50 no uber..."
            disabled={user?.plan !== 'pro'}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-primary outline-none transition-all placeholder:text-gray-600"
          />
          <Button onClick={handleSend} disabled={!input.trim()} className="bg-primary hover:bg-primary/90 rounded-xl px-4 h-[48px] shadow-lg shadow-primary/20">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}