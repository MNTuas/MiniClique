

using MiniClique_Repository;
using MiniClique_Repository.Helper;
using MiniClique_Repository.Interface;
using MiniClique_Service;
using MiniClique_Service.Interface;

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

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserLikesRepository, UserLikesRepository>();
builder.Services.AddScoped<IUserLikesService, UserLikesService>();
builder.Services.AddScoped<IUserMatchesRepository, UserMatchesRepository>();
builder.Services.AddScoped<IUserMatchesService, UserMatchesService>();


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
