# Consultas SQL para o Sistema Educacional

Este documento contém as consultas SQL implementadas para atender às necessidades do Professor Girafales como novo diretor da escola.

## 1. Consulta de Horas de Ensino por Professor

### Endpoint: `GET /educational-system/professors/teaching-hours`

Esta consulta retorna a quantidade de horas que cada professor tem comprometido em aulas.

```sql
SELECT
  p.id as professor_id,
  p.name as professor_name,
  d.name as department_name,
  t.name as title_name,
  COALESCE(SUM(
    EXTRACT(EPOCH FROM (cs.end_time::time - cs.start_time::time)) / 3600
  ), 0) as total_hours
FROM professors p
LEFT JOIN departments d ON p.department_id = d.id
LEFT JOIN titles t ON p.title_id = t.id
LEFT JOIN subjects s ON s.professor_id = p.id
LEFT JOIN classes c ON c.subject_id = s.id
LEFT JOIN class_schedules cs ON cs.class_id = c.id
GROUP BY p.id, p.name, d.name, t.name
ORDER BY total_hours DESC, p.name;
```

### Resultado:

- **Professor Girafales**: 8 horas (Professor Diretor - Matemática)
- **Professor Newton**: 8 horas (Professor Doutor - Física)
- **Professor Heródoto**: 6 horas (Professor Mestre - História)
- **Professor Darwin**: 4 horas (Professor Mestre - Biologia)
- **Professor Einstein**: 4 horas (Professor Doutor - Química)

## 2. Consulta de Salas com Horários Ocupados e Livres

### Endpoint: `GET /educational-system/rooms/schedule`

Esta consulta retorna todas as salas com seus horários ocupados e disponíveis.

```sql
SELECT
  r.id as room_id,
  r.name as room_name,
  r.capacity,
  b.name as building_name,
  cs.day_of_week,
  cs.start_time,
  cs.end_time,
  c.code as class_name,
  s.name as subject_name,
  p.name as professor_name
FROM rooms r
JOIN buildings b ON r.building_id = b.id
LEFT JOIN class_schedules cs ON cs.room_id = r.id
LEFT JOIN classes c ON cs.class_id = c.id
LEFT JOIN subjects s ON c.subject_id = s.id
LEFT JOIN professors p ON s.professor_id = p.id
ORDER BY r.name, cs.day_of_week, cs.start_time;
```

### Funcionalidades Implementadas:

1. **Horários Ocupados**: Mostra todas as aulas agendadas com:

   - Dia da semana
   - Horário de início e fim
   - Nome da disciplina
   - Nome do professor
   - Código da turma

2. **Horários Livres**: Calcula automaticamente os horários disponíveis baseado em:
   - Horário de funcionamento: 08:00 às 18:00
   - Intervalos de 2 horas: 08:00-10:00, 10:00-12:00, 12:00-14:00, 14:00-16:00, 16:00-18:00
   - Dias úteis: Segunda a Sexta

### Exemplo de Resultado:

**Sala 101 - Prédio A - Matemática**

- **Ocupada**:
  - Segunda 08:00-10:00: Álgebra Linear (Professor Girafales)
  - Quarta 08:00-10:00: Álgebra Linear (Professor Girafales)
- **Disponível**:
  - Segunda 10:00-12:00, 12:00-14:00, 14:00-16:00, 16:00-18:00
  - Terça 08:00-10:00, 10:00-12:00, 12:00-14:00, 14:00-16:00, 16:00-18:00
  - Quarta 10:00-12:00, 12:00-14:00, 14:00-16:00, 16:00-18:00
  - Quinta 08:00-10:00, 10:00-12:00, 12:00-14:00, 14:00-16:00, 16:00-18:00
  - Sexta 08:00-10:00, 10:00-12:00, 12:00-14:00, 14:00-16:00, 16:00-18:00

## Estrutura do Banco de Dados

### Tabelas Criadas:

- `departments` - Departamentos acadêmicos
- `titles` - Títulos dos professores
- `professors` - Professores
- `buildings` - Prédios da escola
- `rooms` - Salas de aula
- `subjects` - Disciplinas
- `subject_prerequisites` - Pré-requisitos de disciplinas
- `classes` - Turmas
- `class_schedules` - Horários das aulas

### Relacionamentos:

- Professor pertence a um Departamento e tem um Título
- Sala pertence a um Prédio
- Disciplina pode ter um Professor responsável
- Turma pertence a uma Disciplina
- Horário de aula pertence a uma Turma e é realizada em uma Sala
- Disciplinas podem ter pré-requisitos

## Dados de Exemplo Inseridos

O sistema foi populado com dados de exemplo incluindo:

- 5 departamentos (Matemática, Física, Química, Biologia, História)
- 4 títulos de professor
- 5 professores (incluindo o Professor Girafales como Diretor)
- 4 prédios
- 8 salas de aula
- 8 disciplinas
- 8 turmas
- 15 horários de aula
- 3 pré-requisitos de disciplinas

## Como Usar

1. **Iniciar a aplicação**: `make run`
2. **Consultar horas dos professores**:
   ```bash
   curl -X GET "http://localhost:3000/educational-system/professors/teaching-hours"
   ```
3. **Consultar horários das salas**:
   ```bash
   curl -X GET "http://localhost:3000/educational-system/rooms/schedule"
   ```

Os endpoints retornam dados em formato JSON e estão documentados com Swagger disponível em `http://localhost:3000/api` quando a aplicação estiver rodando.
