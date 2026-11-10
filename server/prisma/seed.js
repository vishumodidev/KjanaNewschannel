import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting JANA NEWS NETWORK database seeding...')

  // ── 1. LANGUAGES ────────────────────────────────────────────────────────────
  const languages = [
    { code: 'kn', nameNative: 'ಕನ್ನಡ',   nameEnglish: 'Kannada', direction: 'ltr', isDefault: true },
    { code: 'en', nameNative: 'English', nameEnglish: 'English', direction: 'ltr', isDefault: false },
    { code: 'hi', nameNative: 'हिन्दी',   nameEnglish: 'Hindi',   direction: 'ltr', isDefault: false },
  ]

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: lang,
      create: lang,
    })
  }
  console.log(`✅ Seeded ${languages.length} languages (kn, en, hi)`)

  // ── 2. STATE & DISTRICTS (KARNATAKA) ────────────────────────────────────────
  const karnataka = await prisma.state.upsert({
    where: { code: 'KA' },
    update: { nameEn: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' },
    create: { code: 'KA', nameEn: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' },
  })

  const districts = [
    { code: 'KA_BLRU', nameEn: 'Bengaluru Urban', nameKn: 'ಬೆಂಗಳೂರು ನಗರ' },
    { code: 'KA_BLRR', nameEn: 'Bengaluru Rural', nameKn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ' },
    { code: 'KA_MYSU', nameEn: 'Mysuru', nameKn: 'ಮೈಸೂರು' },
    { code: 'KA_MAND', nameEn: 'Mandya', nameKn: 'ಮಂಡ್ಯ' },
    { code: 'KA_HASS', nameEn: 'Hassan', nameKn: 'ಹಾಸನ' },
    { code: 'KA_TUMA', nameEn: 'Tumakuru', nameKn: 'ತುಮಕೂರು' },
    { code: 'KA_KOLA', nameEn: 'Kolar', nameKn: 'ಕೋಲಾರ' },
    { code: 'KA_CHIKB', nameEn: 'Chikkaballapura', nameKn: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ' },
    { code: 'KA_RAMA', nameEn: 'Ramanagara', nameKn: 'ರಾಮನಗರ' },
    { code: 'KA_SHIV', nameEn: 'Shivamogga', nameKn: 'ಶಿವಮೊಗ್ಗ' },
    { code: 'KA_CHIKM', nameEn: 'Chikkamagaluru', nameKn: 'ಚಿಕ್ಕಮಗಳೂರು' },
    { code: 'KA_UDUP', nameEn: 'Udupi', nameKn: 'ಉಡುಪಿ' },
    { code: 'KA_DAKK', nameEn: 'Dakshina Kannada', nameKn: 'ದಕ್ಷಿಣ ಕನ್ನಡ' },
    { code: 'KA_UTTK', nameEn: 'Uttara Kannada', nameKn: 'ಉತ್ತರ ಕನ್ನಡ' },
    { code: 'KA_BELA', nameEn: 'Belagavi', nameKn: 'ಬೆಳಗಾವಿ' },
    { code: 'KA_DHAR', nameEn: 'Dharwad', nameKn: 'ಧಾರವಾಡ' },
    { code: 'KA_VIJA', nameEn: 'Vijayapura', nameKn: 'ವಿಜಯಪುರ' },
    { code: 'KA_BAGA', nameEn: 'Bagalkote', nameKn: 'ಬಾಗಲಕೋಟೆ' },
    { code: 'KA_GADA', nameEn: 'Gadag', nameKn: 'ಗದಗ' },
    { code: 'KA_HAVE', nameEn: 'Haveri', nameKn: 'ಹಾವೇರಿ' },
    { code: 'KA_BALL', nameEn: 'Ballari', nameKn: 'ಬಳ್ಳಾರಿ' },
    { code: 'KA_VIJN', nameEn: 'Vijayanagara', nameKn: 'ವಿಜಯನಗರ' },
    { code: 'KA_KALB', nameEn: 'Kalaburagi', nameKn: 'ಕಲಬುರಗಿ' },
    { code: 'KA_BIDA', nameEn: 'Bidar', nameKn: 'ಬೀದರ್' },
    { code: 'KA_RAIC', nameEn: 'Raichur', nameKn: 'ರಾಯಚೂರು' },
    { code: 'KA_KOPP', nameEn: 'Koppal', nameKn: 'ಕೊಪ್ಪಳ' },
    { code: 'KA_YADG', nameEn: 'Yadgir', nameKn: 'ಯಾದಗಿರಿ' },
    { code: 'KA_DAVA', nameEn: 'Davanagere', nameKn: 'ದಾವಣಗೆರೆ' },
    { code: 'KA_CHIT', nameEn: 'Chitradurga', nameKn: 'ಚಿತ್ರದುರ್ಗ' },
    { code: 'KA_KODA', nameEn: 'Kodagu', nameKn: 'ಕೊಡಗು' },
    { code: 'KA_CHAM', nameEn: 'Chamarajanagar', nameKn: 'ಚಾಮರಾಜನಗರ' },
  ]

  for (const d of districts) {
    await prisma.district.upsert({
      where: { stateId_code: { stateId: karnataka.id, code: d.code } },
      update: { nameEn: d.nameEn, nameKn: d.nameKn },
      create: { stateId: karnataka.id, code: d.code, nameEn: d.nameEn, nameKn: d.nameKn },
    })
  }
  console.log(`✅ Seeded Karnataka state + ${districts.length} districts`)

  // ── 3. CATEGORIES ───────────────────────────────────────────────────────────
  const categories = [
    { slug: 'karnataka',     nameEn: 'Karnataka',     nameKn: 'ಕರ್ನಾಟಕ',    sortOrder: 1, icon: 'MapPin' },
    { slug: 'national',      nameEn: 'National',      nameKn: 'ದೇಶ',        sortOrder: 2, icon: 'Flag' },
    { slug: 'international', nameEn: 'International', nameKn: 'ವಿಶ್ವ',       sortOrder: 3, icon: 'Globe' },
    { slug: 'politics',      nameEn: 'Politics',      nameKn: 'ರಾಜಕೀಯ',    sortOrder: 4, icon: 'Landmark' },
    { slug: 'business',      nameEn: 'Business',      nameKn: 'ವ್ಯಾಪಾರ',     sortOrder: 5, icon: 'TrendingUp' },
    { slug: 'technology',    nameEn: 'Technology',    nameKn: 'ತಂತ್ರಜ್ಞಾನ', sortOrder: 6, icon: 'Cpu' },
    { slug: 'sports',        nameEn: 'Sports',        nameKn: 'ಕ್ರೀಡೆ',      sortOrder: 7, icon: 'Trophy' },
    { slug: 'entertainment', nameEn: 'Entertainment', nameKn: 'ಮನರಂಜನೆ',   sortOrder: 8, icon: 'Film' },
    { slug: 'lifestyle',     nameEn: 'Lifestyle',     nameKn: 'ಜೀವನಶೈಲಿ',   sortOrder: 9, icon: 'Heart' },
    { slug: 'education',     nameEn: 'Education',     nameKn: 'ಶಿಕ್ಷಣ',      sortOrder: 10, icon: 'GraduationCap' },
    { slug: 'health',        nameEn: 'Health',        nameKn: 'ಆರೋಗ್ಯ',     sortOrder: 11, icon: 'Heart' },
    { slug: 'agriculture',   nameEn: 'Agriculture',   nameKn: 'ಕೃಷಿ',       sortOrder: 12, icon: 'Sprout' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }
  console.log(`✅ Seeded ${categories.length} taxonomy categories`)

  // ── 4. ROLES (13 SYSTEM ROLES FROM PLAYBOOK SECTION 6) ──────────────────────
  const roles = [
    { name: 'super_admin',          displayName: 'Super Admin',                  description: 'Full system and staff administration', isSystem: true },
    { name: 'managing_editor',      displayName: 'Managing Editor',              description: 'Editorial oversight, review & publishing', isSystem: true },
    { name: 'national_editor',      displayName: 'National Editor',              description: 'National desk content & approval', isSystem: true },
    { name: 'state_bureau_chief',   displayName: 'State Bureau Chief',           description: 'State and district editorial oversight', isSystem: true },
    { name: 'district_reporter',    displayName: 'District Reporter',            description: 'Create and submit stories in assigned district', isSystem: true },
    { name: 'journalist',           displayName: 'Journalist / Reporter',        description: 'Create and submit assigned news drafts', isSystem: true },
    { name: 'copy_editor',          displayName: 'Copy Editor',                  description: 'Language editing and corrections', isSystem: true },
    { name: 'language_editor',      displayName: 'Language Editor / Translator', description: 'Translation tasks and target-language publishing', isSystem: true },
    { name: 'video_editor',         displayName: 'Video Editor',                 description: 'Video assets and publishing', isSystem: true },
    { name: 'social_media_manager', displayName: 'Social Media Manager',         description: 'Social copy distribution', isSystem: true },
    { name: 'ad_manager',           displayName: 'Advertisement Manager',        description: 'Manage advertisers, campaigns and placements', isSystem: true },
    { name: 'auditor',              displayName: 'Auditor',                      description: 'Read-only audit and compliance access', isSystem: true },
    { name: 'reader',               displayName: 'Reader / Subscriber',          description: 'Public reader accounts & bookmarks', isSystem: true },
  ]

  const roleMap = {}
  for (const r of roles) {
    const roleRecord = await prisma.role.upsert({
      where: { name: r.name },
      update: r,
      create: r,
    })
    roleMap[r.name] = roleRecord
  }
  console.log(`✅ Seeded ${roles.length} system roles`)

  // ── 5. PERMISSIONS (GRANULAR PERMISSION MATRIX) ─────────────────────────────
  const permissions = [
    // Articles
    { code: 'article:create',   module: 'articles', description: 'Create article drafts' },
    { code: 'article:edit',     module: 'articles', description: 'Edit article drafts' },
    { code: 'article:submit',   module: 'articles', description: 'Submit article for editorial review' },
    { code: 'article:review',   module: 'articles', description: 'Review submitted articles' },
    { code: 'article:approve',  module: 'articles', description: 'Approve reviewed articles' },
    { code: 'article:publish',  module: 'articles', description: 'Publish approved articles' },
    { code: 'article:schedule', module: 'articles', description: 'Schedule articles for publishing' },
    { code: 'article:retract',  module: 'articles', description: 'Retract or withdraw articles' },
    // Editorial
    { code: 'editorial:assign',     module: 'editorial', description: 'Assign stories to reporters' },
    { code: 'editorial:fact_check', module: 'editorial', description: 'Execute and record fact-check' },
    { code: 'editorial:comment',    module: 'editorial', description: 'Add editorial review comments' },
    // Translations
    { code: 'translation:assign',  module: 'translations', description: 'Assign translation tasks' },
    { code: 'translation:submit',  module: 'translations', description: 'Submit completed translation' },
    { code: 'translation:approve', module: 'translations', description: 'Approve translation for publishing' },
    // Media
    { code: 'media:upload', module: 'media', description: 'Upload media assets' },
    { code: 'media:delete', module: 'media', description: 'Delete media assets' },
    // Users & Roles
    { code: 'user:view',       module: 'users', description: 'View user and staff list' },
    { code: 'user:manage',     module: 'users', description: 'Create and update users' },
    { code: 'user:deactivate', module: 'users', description: 'Deactivate user accounts' },
    { code: 'role:manage',     module: 'roles', description: 'Manage roles and permission grants' },
    // Commercial
    { code: 'ad:manage',       module: 'ads', description: 'Manage advertisers and campaigns' },
    { code: 'ad:view_reports', module: 'ads', description: 'View advertising performance reports' },
    // Analytics & Audit
    { code: 'analytics:view',   module: 'analytics', description: 'View news analytics dashboards' },
    { code: 'analytics:export', module: 'analytics', description: 'Export analytics and reader reports' },
    { code: 'audit:view',       module: 'audit',     description: 'View immutable system audit logs' },
    // System
    { code: 'system:configure', module: 'system', description: 'Configure system settings' },
  ]

  const permMap = {}
  for (const p of permissions) {
    const permRecord = await prisma.permission.upsert({
      where: { code: p.code },
      update: p,
      create: p,
    })
    permMap[p.code] = permRecord
  }
  console.log(`✅ Seeded ${permissions.length} granular permissions`)

  // ── 6. ROLE-PERMISSION MAPPINGS ─────────────────────────────────────────────
  // Grant all permissions to super_admin
  for (const perm of Object.values(permMap)) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: roleMap['super_admin'].id, permissionId: perm.id } },
      update: {},
      create: { roleId: roleMap['super_admin'].id, permissionId: perm.id },
    })
  }

  // Managing Editor grants
  const managingEditorPerms = [
    'article:create', 'article:edit', 'article:submit', 'article:review', 'article:approve', 'article:publish', 'article:schedule', 'article:retract',
    'editorial:assign', 'editorial:fact_check', 'editorial:comment',
    'translation:assign', 'translation:approve',
    'media:upload', 'media:delete',
    'user:view', 'analytics:view', 'audit:view',
  ]
  for (const code of managingEditorPerms) {
    if (permMap[code]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roleMap['managing_editor'].id, permissionId: permMap[code].id } },
        update: {},
        create: { roleId: roleMap['managing_editor'].id, permissionId: permMap[code].id },
      })
    }
  }

  // District Reporter grants
  const districtReporterPerms = ['article:create', 'article:edit', 'article:submit', 'media:upload']
  for (const code of districtReporterPerms) {
    if (permMap[code]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roleMap['district_reporter'].id, permissionId: permMap[code].id } },
        update: {},
        create: { roleId: roleMap['district_reporter'].id, permissionId: permMap[code].id },
      })
    }
  }

  // Translator grants
  const translatorPerms = ['translation:submit', 'article:create', 'article:edit']
  for (const code of translatorPerms) {
    if (permMap[code]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roleMap['language_editor'].id, permissionId: permMap[code].id } },
        update: {},
        create: { roleId: roleMap['language_editor'].id, permissionId: permMap[code].id },
      })
    }
  }

  console.log('✅ Configured Role-Permission matrices')

  // ── 7. INITIAL SUPER ADMIN USER ─────────────────────────────────────────────
  const adminEmail = 'superadmin@jananewsnetwork.com'
  const hashedPassword = await hashPassword('AdminPassword@123')

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
      displayName: 'Jana Super Admin',
      isActive: true,
    },
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      displayName: 'Jana Super Admin',
      isActive: true,
    },
  })

  // Assign super_admin role
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: roleMap['super_admin'].id } },
    update: {},
    create: { userId: superAdmin.id, roleId: roleMap['super_admin'].id },
  })

  // Assign global scope
  const existingScope = await prisma.userScopeAssignment.findFirst({
    where: { userId: superAdmin.id, roleId: roleMap['super_admin'].id, scopeType: 'GLOBAL' },
  })
  if (!existingScope) {
    await prisma.userScopeAssignment.create({
      data: {
        userId: superAdmin.id,
        roleId: roleMap['super_admin'].id,
        scopeType: 'GLOBAL',
      },
    })
  }

  console.log(`✅ Seeded Super Admin: ${adminEmail} (password: AdminPassword@123)`)
  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
