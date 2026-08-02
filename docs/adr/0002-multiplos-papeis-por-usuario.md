---
status: accepted
---

# Múltiplos papéis por usuário via tabela user_roles

Até aqui, `User.role` era um enum nullable único (`ADOTANTE` | `DOADOR` | `ADMIN`) — decisão explícita de manter papel exclusivo, tomada em 2026-08-01 ao desenhar as checagens de ownership de `adotantes`/`doadores`. O onboarding multiselect (usuário pode escolher ser ADOTANTE e DOADOR ao mesmo tempo, no mesmo fluxo) exige suportar mais de um papel por usuário, revertendo aquela decisão.

**Decisão:** substituir a coluna `users.role` por uma tabela `user_roles` (`userId`, `role`), fonte única da verdade para todos os papéis — incluindo `ADMIN`, que hoje não tem entidade de perfil própria. Como o projeto ainda não tem usuários reais, a migration não precisa de backfill: a coluna antiga é simplesmente removida.

## Considered Options

Também foi avaliado **derivar** os papéis ADOTANTE/DOADOR da existência de linhas em `Adotante`/`Doador` (mantendo só um flag separado para ADMIN, já que este não tem tabela de perfil). Rejeitado por dois motivos: (1) criaria dois caminhos de checagem de autorização diferentes — um derivado por join/exists, outro por flag direto — divergência que é uma fonte clássica de bug de authz; (2) acoplaria a revogação de um papel à exclusão do perfil, o que quebraria silenciosamente se `Adotante`/`Doador` algum dia passarem a usar soft-delete (papel persistiria mesmo com o perfil "removido"). A tabela `user_roles` mantém concessão/revogação de papel como uma ação explícita, independente do CRUD de perfil.
