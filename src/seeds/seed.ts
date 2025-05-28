import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Conexão com o banco de dados estabelecida');

    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('123456', salt);

    const adminUser = await userRepository.save({
      name: 'Administrador',
      email: 'admin@exemplo.com',
      password: hashedPassword,
    });

    console.log('Usuário admin criado');

    const defaultCompany = await companyRepository.save({
      name: 'Empresa Padrão',
      cnpj: '12.345.678/0001-90',
      workHours: 8,
      lunchBreak: 1,
      users: [adminUser],
    });

    console.log('Empresa padrão criada');

    console.log('Dados iniciais inseridos com sucesso!');
    console.log('-------------------------------------');
    console.log('Credenciais de acesso:');
    console.log('Email: admin@exemplo.com');
    console.log('Senha: 123456');
    console.log('-------------------------------------');

  } catch (error) {
    console.error('Erro ao inserir dados iniciais:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
