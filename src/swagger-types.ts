export function ApiTags(...tags: string[]) {
  return function(target: any) {
    return target;
  };
}

export function ApiOperation(options: { summary: string; description?: string }) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    return descriptor;
  };
}

export function ApiBody(options: { type: any; description?: string }) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    return descriptor;
  };
}

export function ApiResponse(options: { status: number; description: string; type?: any }) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    return descriptor;
  };
}

export function ApiProperty(options?: { description?: string; example?: any; required?: boolean }) {
  return function(target: any, propertyKey: string) {
    return target;
  };
}

export class DocumentBuilder {
  private config: any = {};

  setTitle(title: string): DocumentBuilder {
    this.config.title = title;
    return this;
  }

  setDescription(description: string): DocumentBuilder {
    this.config.description = description;
    return this;
  }

  setVersion(version: string): DocumentBuilder {
    this.config.version = version;
    return this;
  }

  addTag(name: string, description?: string): DocumentBuilder {
    if (!this.config.tags) {
      this.config.tags = [];
    }
    this.config.tags.push({ name, description });
    return this;
  }

  build() {
    return this.config;
  }
}


export class SwaggerModule {
  static createDocument(app: any, config: any) {
    return { openapi: '3.0.0', ...config };
  }

  static setup(path: string, app: any, document: any) {
    console.log(`Swagger configurado em ${path}`);
  }
}
