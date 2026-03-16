const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function main() {
    console.log('🌱 Starting full seeding (JS)...');

    // 1. Clean database
    try {
        await db.standing.deleteMany();
        await db.match.deleteMany();
        await db.player.deleteMany();
        await db.team.deleteMany();
        await db.category.deleteMany();
        await db.news.deleteMany();
        await db.user.deleteMany();
    } catch (e) {
        console.log('Clean skipped or failed (might be first run)');
    }

    // 2. Create Admin
    const hashedPassword = await bcrypt.hash('aifb2025', 10);
    await db.user.create({
        data: {
            email: 'admin@aifb.com',
            password: hashedPassword,
            name: 'Admin Pino Futbol',
        },
    });

    // 3. Define Categories
    const categoryNames = [
        'Primera División A', 'Primera División B', 'Primera División C',
        'Senior', 'Super Senior',
        'Cuarta', 'Quinta'
    ];

    const categories = {};
    for (const name of categoryNames) {
        categories[name] = await db.category.create({ data: { name } });
    }

    // 4. Helper function
    const createTeamAndStanding = async (name, neighborhood, catId, stats) => {
        const team = await db.team.create({
            data: { name, neighborhood, categoryId: catId }
        });
        await db.standing.create({
            data: {
                categoryId: catId,
                teamId: team.id,
                ...stats
            }
        });
        return team;
    };

    // --- PRIMERA A ---
    console.log('⚽ Seeding Primera A...');
    await createTeamAndStanding('Deportivo Km 3', 'Km 3', categories['Primera División A'].id, { played: 5, won: 4, drawn: 1, lost: 0, goalsFor: 12, goalsAgainst: 3, points: 13 });
    await createTeamAndStanding('Güer Aike FC', 'Güer Aike', categories['Primera División A'].id, { played: 5, won: 3, drawn: 1, lost: 1, goalsFor: 10, goalsAgainst: 5, points: 10 });
    await createTeamAndStanding('Belgrano RG', 'Belgrano', categories['Primera División A'].id, { played: 5, won: 2, drawn: 2, lost: 1, goalsFor: 8, goalsAgainst: 7, points: 8 });

    // --- PRIMERA B ---
    console.log('⚽ Seeding Primera B...');
    await createTeamAndStanding('Estudiantes RG', 'Pje. San Juan', categories['Primera División B'].id, { played: 4, won: 3, drawn: 1, lost: 0, goalsFor: 9, goalsAgainst: 2, points: 10 });
    await createTeamAndStanding('Talleres Gallegos', 'Centro', categories['Primera División B'].id, { played: 4, won: 2, drawn: 0, lost: 2, goalsFor: 6, goalsAgainst: 6, points: 6 });

    // --- PRIMERA C ---
    console.log('⚽ Seeding Primera C...');
    await createTeamAndStanding('Chacarita RG', 'San Benito', categories['Primera División C'].id, { played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 10, goalsAgainst: 1, points: 9 });
    await createTeamAndStanding('Los Amigos FC', '499 Viviendas', categories['Primera División C'].id, { played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 5, points: 4 });

    // --- VETERANOS SENIOR ---
    console.log('⚽ Seeding Senior...');
    await createTeamAndStanding('Gallego Senior', 'Fátima', categories['Senior'].id, { played: 6, won: 5, drawn: 0, lost: 1, goalsFor: 15, goalsAgainst: 8, points: 15 });

    // --- VETERANOS SUPER SENIOR ---
    console.log('⚽ Seeding Super Senior...');
    await createTeamAndStanding('Leyendas RG', 'Aduana', categories['Super Senior'].id, { played: 4, won: 4, drawn: 0, lost: 0, goalsFor: 8, goalsAgainst: 1, points: 12 });

    // --- JUVENILES CUARTA ---
    console.log('⚽ Seeding Cuarta...');
    await createTeamAndStanding('Boxing Club Juv', 'San Benito', categories['Cuarta'].id, { played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 7, goalsAgainst: 0, points: 6 });

    // --- JUVENILES QUINTA ---
    console.log('⚽ Seeding Quinta...');
    await createTeamAndStanding('U. Santacruceña Juv', '499 Viviendas', categories['Quinta'].id, { played: 2, won: 1, drawn: 1, lost: 0, goalsFor: 4, goalsAgainst: 2, points: 4 });

    console.log('✅ Full Seeding (JS) completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
