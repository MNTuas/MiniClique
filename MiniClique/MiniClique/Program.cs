

using MiniClique_Repository.Helper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//Cors
builder.Services.AddCors(p => p.AddPolicy("FFilms", build =>
{
    build.WithOrigins("https://ffilm-two.vercel.app", "http://localhost:5173")
    .AllowAnyMethod()
    .AllowAnyHeader();
}));

//database
builder.Services.Configure<DatabaseSettings>
(
    builder.Configuration.GetSection("MyDb")
);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FFilms");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
