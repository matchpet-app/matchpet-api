# MatchPet API

Backend de uma plataforma de adoção de pets, conectando pessoas que querem adotar (adotantes) com pessoas/organizações que têm pets para doação (doadores).

## Language

**Papel (Role)**:
Uma capacidade que um `User` exerce na plataforma: `ADOTANTE`, `DOADOR` ou `ADMIN`. A partir da decisão de 2026-08-02, um usuário pode acumular **mais de um papel simultaneamente** (ex.: ser ADOTANTE e DOADOR ao mesmo tempo) — reverte a decisão anterior de papel único (ver `docs/adr` quando a modelagem de armazenamento for fechada).
_Avoid_: Role (em código o enum já se chama `RoleUser`, mantenha o termo em inglês só ali; na conversa/domínio use "papel")

**Perfil (Adotante / Doador)**:
Os dados específicos de um papel — CPF, endereço, moradia para `Adotante`; CNPJ/tipo/descrição para `Doador`. Um usuário com o papel ADOTANTE tem exatamente um perfil `Adotante`; o mesmo vale para DOADOR. Distinto de "papel": o papel é a permissão/capacidade, o perfil é os dados cadastrais que a sustentam.

**Onboarding**:
O fluxo, no primeiro acesso, em que o usuário escolhe qual(is) papel(is) quer exercer (ADOTANTE e/ou DOADOR — nunca ADMIN) e preenche os dados de perfil correspondentes. É um formulário multistep no frontend, mas resulta em **um único POST** ao backend na conclusão — não um POST por etapa. Só pode ser concluído por um usuário que ainda não tem nenhum papel; ganhar um papel adicional depois é um fluxo separado, não onboarding.

**Termos de Uso**:
O contrato entre a plataforma e o usuário (uso da conta, tratamento de dados). O aceite é registrado uma vez, na criação da conta (primeiro login) — não faz parte do onboarding nem exige checkbox, só um aviso na tela de login. Distinto de **Termos de Compromisso** (`Adocao.termos`, ver `TermosCompromisso`), que são os compromissos assumidos por um adotante numa adoção específica (responsabilidade de longo prazo, tempo de adaptação, custos veterinários) — conceito diferente, já existente no código, não confundir os dois.
