import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getRanksForModality, MODALITIES } from '../data/mockData';
import { AcademyAccount, AuthMode, UserProfile, UserRole } from '../types/sparring';

interface AuthScreenProps {
  initialMode: AuthMode;
  initialRole: UserRole;
  defaultUser: UserProfile;
  defaultAcademy: AcademyAccount;
  onBackHome: () => void;
  onCompleteFighter: (profile?: UserProfile) => void;
  onCompleteAcademy: (academy?: AcademyAccount) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode,
  initialRole,
  defaultUser,
  defaultAcademy,
  onBackHome,
  onCompleteFighter,
  onCompleteAcademy,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);

  // Fighter registration fields
  const [name, setName] = useState(defaultUser.name);
  const [modality, setModality] = useState(defaultUser.modality);
  const availableRanks = getRanksForModality(modality);
  const [rankName, setRankName] = useState(availableRanks[availableRanks.length - 1]?.name || defaultUser.rank);
  const [height, setHeight] = useState(defaultUser.height);
  const [weight, setWeight] = useState(defaultUser.weight);
  const [category, setCategory] = useState<'Amador' | 'Profissional'>(defaultUser.category);
  const [stance, setStance] = useState<'Destro' | 'Canhoto'>(defaultUser.stance);
  const [city, setCity] = useState(defaultUser.city);

  // Academy registration fields
  const [gymName, setGymName] = useState(defaultAcademy.gymName);
  const [coachName, setCoachName] = useState(defaultAcademy.coachName);
  const [gymCity, setGymCity] = useState(defaultAcademy.neighborhood);
  const [gymSpace, setGymSpace] = useState(defaultAcademy.spaceType);

  const [email, setEmail] = useState(
    initialRole === 'fighter' ? 'pedro.hipolito@sparring.app' : 'contato@ctnovaerabh.com.br',
  );
  const [password, setPassword] = useState('sparring2026');

  const handleModalityChange = (newMod: string) => {
    setModality(newMod);
    const ranks = getRanksForModality(newMod);
    setRankName(ranks[0]?.name || 'Iniciante');
  };

  const handleRoleSwitch = (nextRole: UserRole) => {
    setRole(nextRole);
    setEmail(nextRole === 'fighter' ? 'pedro.hipolito@sparring.app' : 'contato@ctnovaerabh.com.br');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'fighter') {
      if (mode === 'register') {
        const chosenRank = availableRanks.find((r) => r.name === rankName) || availableRanks[0];
        onCompleteFighter({
          ...defaultUser,
          name: name.trim() || 'Pedro Hipolito',
          modality,
          rank: chosenRank.name,
          rankLevel: chosenRank.levelNum,
          height: Number(height) || 178,
          weight: Number(weight) || 76,
          category,
          stance,
          city: city.trim() || 'Savassi, Belo Horizonte',
        });
      } else {
        onCompleteFighter();
      }
    } else {
      if (mode === 'register') {
        onCompleteAcademy({
          gymName: gymName.trim() || 'CT Nova Era BH',
          coachName: coachName.trim() || 'Mestre Ricardo Alves',
          neighborhood: gymCity.trim() || 'Centro, Belo Horizonte',
          spaceType: gymSpace.trim() || 'Ringue + Tatame 80m2',
        });
      } else {
        onCompleteAcademy();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 border border-gridline bg-carbon shadow-2xl">
        {/* Brand Side */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-gridline p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-2 border border-neutral-700 bg-surface hover:border-neutral-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300 mb-8 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Homepage
            </button>

            <div className="text-4xl font-black tracking-tight leading-none">SparRing</div>
            <div className="w-16 h-1 bg-sparring mt-3" />
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-sparring mt-3">
              Onde cada round conta.
            </div>

            <div className="space-y-4 mt-8">
              <div className="border-l-2 border-sparring pl-3.5">
                <div className="text-xs font-extrabold uppercase tracking-wider">Cadastro Completo do Lutador</div>
                <p className="text-xs text-neutral-400 mt-1">
                  Arte marcial, graduacao dinamica, altura, peso, categoria (Amador ou Profissional), base (Destro ou Canhoto) e bairro/cidade.
                </p>
              </div>
              <div className="border-l-2 border-sparring pl-3.5">
                <div className="text-xs font-extrabold uppercase tracking-wider">Portal Independente da Academia</div>
                <p className="text-xs text-neutral-400 mt-1">
                  Ambiente exclusivo para mestres validarem alunos, monitorarem evasao e gerenciarem horarios ociosos de tatame.
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-neutral-500 border-t border-gridline pt-4 mt-8">
            Ecossistema de Combate | Belo Horizonte e Regiao Metropolitana
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-7 bg-surface p-7 sm:p-9">
          <div className="grid grid-cols-2 border border-neutral-700 mb-4">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2.5 text-xs font-extrabold uppercase tracking-wider transition ${
                mode === 'login' ? 'bg-sparring text-white' : 'bg-carbon text-neutral-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2.5 text-xs font-extrabold uppercase tracking-wider transition ${
                mode === 'register' ? 'bg-sparring text-white' : 'bg-carbon text-neutral-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleRoleSwitch('fighter')}
              className={`p-3 border text-left transition ${
                role === 'fighter'
                  ? 'border-sparring bg-sparring/10 text-white'
                  : 'border-neutral-700 bg-carbon text-neutral-400 hover:border-neutral-500'
              }`}
            >
              <div className="text-xs font-extrabold uppercase tracking-wider">Sou Lutador</div>
              <div className={`text-[11px] mt-0.5 ${role === 'fighter' ? 'text-sparring' : 'text-neutral-500'}`}>
                Portal Atleta (B2C)
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('academy')}
              className={`p-3 border text-left transition ${
                role === 'academy'
                  ? 'border-sparring bg-sparring/10 text-white'
                  : 'border-neutral-700 bg-carbon text-neutral-400 hover:border-neutral-500'
              }`}
            >
              <div className="text-xs font-extrabold uppercase tracking-wider">Academia / Treinador</div>
              <div className={`text-[11px] mt-0.5 ${role === 'academy' ? 'text-sparring' : 'text-neutral-500'}`}>
                Portal Gestor (B2B)
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && role === 'fighter' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Arte Marcial
                    </label>
                    <select
                      value={modality}
                      onChange={(e) => handleModalityChange(e.target.value)}
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                    >
                      {MODALITIES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Graduacao (ou Nivel)
                    </label>
                    <select
                      value={rankName}
                      onChange={(e) => setRankName(e.target.value)}
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                    >
                      {availableRanks.map((r) => (
                        <option key={r.name} value={r.name}>
                          {r.name} ({r.levelLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      min={140}
                      max={220}
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      required
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      min={45}
                      max={150}
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      required
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Categoria
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as 'Amador' | 'Profissional')}
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                    >
                      <option value="Amador">Amador</option>
                      <option value="Profissional">Profissional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Base / Guarda
                    </label>
                    <select
                      value={stance}
                      onChange={(e) => setStance(e.target.value as 'Destro' | 'Canhoto')}
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                    >
                      <option value="Destro">Destro</option>
                      <option value="Canhoto">Canhoto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Bairro / Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                  />
                </div>
              </>
            )}

            {mode === 'register' && role === 'academy' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Nome da Academia / CT
                  </label>
                  <input
                    type="text"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    required
                    className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Mestre / Treinador Responsavel
                  </label>
                  <input
                    type="text"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    required
                    className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Bairro / Cidade
                    </label>
                    <input
                      type="text"
                      value={gymCity}
                      onChange={(e) => setGymCity(e.target.value)}
                      required
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Estrutura
                    </label>
                    <input
                      type="text"
                      value={gymSpace}
                      onChange={(e) => setGymSpace(e.target.value)}
                      required
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sparring hover:bg-[#ff6a1f] py-3 text-xs font-extrabold uppercase tracking-wider text-white transition mt-2"
            >
              {mode === 'register'
                ? role === 'fighter'
                  ? 'Finalizar Cadastro de Lutador'
                  : 'Finalizar Cadastro da Academia'
                : role === 'fighter'
                  ? 'Entrar no Portal do Lutador'
                  : 'Entrar no Portal da Academia'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
